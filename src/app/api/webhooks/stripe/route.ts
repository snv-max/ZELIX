import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { mockDb } from '@/lib/mockData';
import { sendOrderConfirmationEmail } from '@/lib/email';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2025-01-27.accredited-grants' as any,
}) : null;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    if (!stripe || !webhookSecret) {
      console.warn('Stripe Webhook config missing. Stripe Secret/Webhook Secret not set.');
      return NextResponse.json({ received: false, warning: 'Credentials missing' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId || '';
      const shippingAddress = session.metadata?.shippingAddress 
        ? JSON.parse(session.metadata.shippingAddress) 
        : {};
      const cart = session.metadata?.cart ? JSON.parse(session.metadata.cart) : [];
      const totalAmount = (session.amount_total || 0) / 100; // Cents to Dollars
      
      console.log(`Processing successful Stripe payment for session: ${session.id}`);

      // Sync order to database
      if (supabase) {
        // 1. Insert order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: totalAmount,
            status: 'processing',
            shipping_address: shippingAddress,
            stripe_session_id: session.id,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Insert order items and update inventories
        const orderItemsToInsert = cart.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: 0, // In production, query the actual product price to prevent manipulation
          size: item.size,
          color: item.color,
        }));

        // Fetch prices from DB to ensure validity
        const productIds = cart.map((item: any) => item.productId);
        const { data: productsData } = await supabase
          .from('products')
          .select('id, price, inventory')
          .in('id', productIds);

        if (productsData) {
          orderItemsToInsert.forEach((item: any) => {
            const prod = productsData.find((p: any) => p.id === item.product_id);
            if (prod) {
              item.price = prod.price;
            }
          });
        }

        // Insert items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        // Trigger order confirmation email (async)
        const emailItems = orderItemsToInsert.map((item: any) => {
          const cartItem = cart.find((c: any) => c.productId === item.product_id);
          return {
            ...item,
            product: cartItem ? cartItem.product : undefined
          };
        });
        
        sendOrderConfirmationEmail(
          {
            ...orderData,
            items: emailItems
          } as any,
          session.customer_email || shippingAddress.email || ''
        );

        // Update each product's inventory
        for (const item of cart) {
          const dbProd = productsData?.find((p: any) => p.id === item.productId);
          if (dbProd) {
            const newInventory = Math.max(0, dbProd.inventory - item.quantity);
            await supabase
              .from('products')
              .update({ inventory: newInventory })
              .eq('id', item.productId);
          }
        }
      } else {
        // Fallback sync to local mock DB
        console.log('No active Supabase connection. Saving Stripe checkout details to mockDb.');
        const mockOrder = mockDb.createOrder(
          {
            user_id: userId,
            total_amount: totalAmount,
            status: 'processing',
            shipping_address: shippingAddress,
            stripe_session_id: session.id,
          },
          cart.map((item: any) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: 0, // will fall back to mock price inside mockDb
            size: item.size,
            color: item.color,
          }))
        );

        // Trigger email confirmation for mock fallback (async)
        const orderForEmail = {
          ...mockOrder,
          items: cart.map((item: any) => ({
            id: 'mock_item_' + Math.random().toString(36).substr(2, 9),
            order_id: mockOrder.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
            product: item.product
          }))
        };
        sendOrderConfirmationEmail(orderForEmail as any, session.customer_email || shippingAddress.email || '');
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
