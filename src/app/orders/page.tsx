'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockDb } from '@/lib/mockData';
import { Order, OrderItem } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import { ClipboardList, Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        if (isSupabaseConfigured && supabase) {
          // Fetch from Supabase
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (ordersError) throw ordersError;

          const ordersWithItemsList: OrderWithItems[] = [];

          for (const order of (ordersData || [])) {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('*, products(*)')
              .eq('order_id', order.id);

            if (itemsError) throw itemsError;

            // map db output to OrderItem structure
            const itemsMapped = (itemsData || []).map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color,
              product: item.products,
            }));

            ordersWithItemsList.push({
              ...order,
              items: itemsMapped,
            });
          }

          setOrders(ordersWithItemsList);
        } else {
          // Fetch from MockDb
          const mockOrdersList = mockDb.getOrders(user.id);
          const mappedMockList = mockOrdersList.map(order => {
            const items = mockDb.getOrderItems(order.id);
            return {
              ...order,
              items,
            };
          });
          setOrders(mappedMockList);
        }
      } catch (err) {
        console.error('Error loading order history:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return <span className="bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">Processing</span>;
      case 'shipped':
        return <span className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">Cancelled</span>;
      default:
        return <span className="bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">Pending</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground grid-bg px-4">
        <div className="max-w-md w-full text-center border border-border bg-card p-10 rounded">
          <ClipboardList className="h-12 w-12 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">No Orders Placed</h2>
          <p className="text-sm text-muted-foreground mb-8">
            You haven't completed any orders yet. Place your first purchase to track its shipping and invoice details here.
          </p>
          <Link 
            href="/products" 
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded py-4 hover:bg-zinc-200 transition-colors"
          >
            Shop Collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-8 sm:mb-12 border-b border-border pb-6">
          ORDER HISTORY
        </h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-card border border-border rounded overflow-hidden shadow-lg animate-fade-in"
            >
              
              {/* Order Header Summary */}
              <div className="bg-[#0e0e14] border-b border-border/80 p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-muted-foreground">
                <div className="grid grid-cols-2 sm:flex gap-6 sm:gap-10">
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-500 mb-1">Order Date</span>
                    <span className="text-white flex items-center gap-1.5 font-bold">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-500 mb-1">Total Paid</span>
                    <span className="text-white flex items-center gap-1 font-bold">
                      ₹{order.total_amount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-500 mb-1">Fulfillment</span>
                    <span className="block mt-0.5">{getStatusBadge(order.status)}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="block text-[10px] uppercase text-zinc-500 mb-1">Session Reference</span>
                  <span className="text-white text-[11px] truncate max-w-[200px] inline-block align-bottom font-bold">
                    {order.stripe_session_id || order.id}
                  </span>
                </div>
              </div>

              {/* Order Body Details */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Items List */}
                <div className="md:col-span-8 space-y-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 border border-border/40 p-3 rounded bg-zinc-950/20"
                    >
                      <div className="relative w-12 sm:w-16 aspect-[4/5] bg-zinc-900 rounded overflow-hidden shrink-0 border border-border/40">
                        <Image 
                          src={item.product?.images[0] || '/logo.png'}
                          alt={item.product?.name || 'Garment'}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                            {item.product ? (
                              <Link href={`/products/${item.product.slug}`} className="hover:underline flex items-center gap-1">
                                {item.product.name}
                                <ExternalLink className="h-3 w-3 text-muted-foreground inline" />
                              </Link>
                            ) : (
                              'Unknown Garment'
                            )}
                          </h4>
                          <span className="text-sm font-bold text-white font-mono">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 text-[11px] font-mono text-muted-foreground mt-1">
                          <span>Qty: <strong className="text-zinc-300">{item.quantity}</strong></span>
                          {item.size && <span>Size: <strong className="text-zinc-300">{item.size}</strong></span>}
                          {item.color && <span>Color: <strong className="text-zinc-300">{item.color}</strong></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Details */}
                <div className="md:col-span-4 bg-[#0d0d11]/50 border border-border/60 p-4 rounded text-xs font-mono">
                  <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold border-b border-border/60 pb-2 mb-3 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                    Delivery Destination
                  </h4>
                  <div className="text-muted-foreground space-y-1.5">
                    <p className="font-semibold text-white">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                    <p>{order.shipping_address.country}</p>
                    {order.shipping_address.email && (
                      <p className="border-t border-border/40 pt-2 mt-2 text-[10px] text-zinc-500 truncate">
                        Contact: {order.shipping_address.email}
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
