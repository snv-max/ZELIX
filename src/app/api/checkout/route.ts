import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';

// Instantiate Stripe only if secret key is present
const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2025-01-27.accredited-grants' as any, // standard API versioning compatibility
}) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, shippingAddress, userId } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // 1. Fallback if Stripe is not configured
    if (!stripe) {
      console.warn('STRIPE_SECRET_KEY environment variable not configured. Returning simulated response.');
      return NextResponse.json({ 
        id: 'mock_stripe_session_' + Math.random().toString(36).substr(2, 9),
        warning: 'Using mock session because Stripe credentials are not set.'
      });
    }

    // 2. Build Stripe Line Items
    const lineItems = cart.map((item: any) => {
      // Create detailed description with variants
      const variantDesc = [
        item.size ? `Size: ${item.size}` : null,
        item.color ? `Color: ${item.color}` : null,
      ].filter(Boolean).join(', ');

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: variantDesc || item.product.description.substring(0, 100),
            images: item.product.images[0] ? [new URL(item.product.images[0], origin).toString()] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // 3. Apply Shipping fee if total cart amount is under $200
    const cartTotal = cart.reduce((tot: number, item: any) => tot + item.product.price * item.quantity, 0);
    if (cartTotal < 200) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Express Shipping & Handling',
            description: 'Flat shipping fee for orders under $200',
          },
          unit_amount: 1500, // $15.00
        },
        quantity: 1,
      });
    }

    // 4. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: shippingAddress.email,
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        cart: JSON.stringify(cart.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Stripe API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
