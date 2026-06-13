'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockDb } from '@/lib/mockData';
import { Order, OrderItem } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import { User, ClipboardList, Key, Mail, ShieldCheck, Sparkles, Check, Calendar, MapPin, ExternalLink, Settings, LogOut } from 'lucide-react';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export default function AccountPage() {
  const { user, profile, isLoading: authLoading, updatePassword, signOut, isAdmin } = useAuth();
  const router = useRouter();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Form states
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Orders states
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // 1. Guard route: redirect logged-out users to /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
    }
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [user, profile, authLoading, router]);

  // 2. Fetch user orders
  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      setOrdersLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
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
        setOrdersLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user.id);
        if (error) throw error;
      } else {
        const mockUsers = JSON.parse(localStorage.getItem('zelix_mock_users') || '[]');
        const idx = mockUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
          mockUsers[idx].full_name = fullName;
          localStorage.setItem('zelix_mock_users', JSON.stringify(mockUsers));
        }
        
        const session = JSON.parse(localStorage.getItem('zelix_mock_session') || '{}');
        session.full_name = fullName;
        localStorage.setItem('zelix_mock_session', JSON.stringify(session));
        
        window.location.reload();
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordSuccess(false);

    const { error } = await updatePassword(password);
    if (error) {
      alert(error.message || 'Error updating password');
    } else {
      setPasswordSuccess(true);
      setPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setIsUpdatingPassword(false);
  };

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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-8 sm:mb-12 border-b border-border pb-6">
          MY ACCOUNT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Info & Nav Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass p-6 rounded border border-border flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full border border-border bg-white/5 flex items-center justify-center mb-4 text-white">
                <User className="h-10 w-10" />
              </div>
              
              <h2 className="text-base font-bold text-white truncate max-w-full">
                {profile?.full_name || 'ZELIX Member'}
              </h2>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-full mb-4">
                {user.email}
              </p>

              <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-black bg-white px-2.5 py-1 rounded">
                Role: {profile?.role || 'Customer'}
              </span>
            </div>

            {/* Nav tabs */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm uppercase tracking-widest font-semibold transition-all ${activeTab === 'profile' ? 'bg-white text-black font-extrabold' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
              >
                <User className="h-4.5 w-4.5" />
                Profile Settings
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm uppercase tracking-widest font-semibold transition-all ${activeTab === 'orders' ? 'bg-white text-black font-extrabold' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
              >
                <ClipboardList className="h-4.5 w-4.5" />
                Order History
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm uppercase tracking-widest font-semibold text-accent hover:text-white hover:bg-white/5 transition-all border-t border-border/40 mt-4 pt-4"
                >
                  <Settings className="h-4.5 w-4.5" />
                  Admin Console
                </Link>
              )}

              <button
                onClick={() => {
                  signOut();
                  router.push('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm uppercase tracking-widest font-semibold text-error hover:bg-error/5 transition-all border-t border-border/40 mt-2 pt-4"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-9">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                
                {/* Profile Edit */}
                <div className="glass p-6 rounded border border-border">
                  <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
                    <Sparkles className="h-4.5 w-4.5 text-accent" />
                    <h3 className="text-sm font-mono uppercase tracking-widest text-white font-bold">Personal Profile</h3>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          disabled 
                          value={user.email || ''}
                          className="w-full bg-[#18181b]/30 border border-border/80 text-sm text-zinc-500 rounded pl-10 pr-3 py-2.5 cursor-not-allowed"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Mercer"
                          className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isUpdatingProfile}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                      {isUpdatingProfile ? (
                        'Saving...'
                      ) : profileSuccess ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Saved
                        </span>
                      ) : (
                        'Save Settings'
                      )}
                    </button>
                  </form>
                </div>

                {/* Password Update */}
                <div className="glass p-6 rounded border border-border">
                  <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
                    <Key className="h-4.5 w-4.5 text-accent" />
                    <h3 className="text-sm font-mono uppercase tracking-widest text-white font-bold">Security</h3>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">New Password</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                        />
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1">Minimum 6 characters required.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                      {isUpdatingPassword ? (
                        'Updating...'
                      ) : passwordSuccess ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Updated
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </form>
                </div>

                {/* System Info */}
                <div className="border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
                  <span>
                    Your session is secured with {isSupabaseConfigured ? 'Supabase Auth.' : 'local browser mock session storage.'}
                  </span>
                </div>

              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                {ordersLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center">
                    <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-white animate-spin mb-3" />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Syncing history...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border border-dashed border-border p-12 text-center rounded">
                    <ClipboardList className="h-8 w-8 text-zinc-700 mx-auto mb-4" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No Orders Logged</h4>
                    <p className="text-xs text-muted-foreground mb-6">You haven't submitted any purchases yet.</p>
                    <Link
                      href="/products"
                      className="px-6 py-2.5 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className="bg-card border border-border rounded overflow-hidden shadow-lg"
                      >
                        {/* Order Header Summary */}
                        <div className="bg-[#0e0e14] border-b border-border/85 p-4 flex flex-col sm:flex-row justify-between gap-3 font-mono text-xs text-muted-foreground">
                          <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <div>
                              <span className="block text-[9px] uppercase text-zinc-500 mb-0.5">Order Date</span>
                              <span className="text-white flex items-center gap-1.5 font-bold">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(order.created_at)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-zinc-500 mb-0.5">Total Paid</span>
                              <span className="text-white flex items-center gap-1 font-bold">
                                ₹{order.total_amount}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-zinc-500 mb-0.5">Fulfillment</span>
                              <span className="block mt-0.5">{getStatusBadge(order.status)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase text-zinc-500 mb-0.5">Session</span>
                            <span className="text-white text-[10px] truncate max-w-[150px] inline-block font-bold">
                              {order.stripe_session_id || order.id}
                            </span>
                          </div>
                        </div>

                        {/* Order Body Details */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          
                          {/* Items List */}
                          <div className="md:col-span-8 space-y-3">
                            {order.items.map((item) => (
                              <div 
                                key={item.id} 
                                className="flex items-center gap-3 border border-border/30 p-2.5 rounded bg-zinc-950/20"
                              >
                                <div className="relative w-12 aspect-[4/5] bg-zinc-900 rounded overflow-hidden shrink-0 border border-border/40">
                                  <Image 
                                    src={item.product?.images[0] || '/logo.png'}
                                    alt={item.product?.name || 'Garment'}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex-grow">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-xs font-bold text-white line-clamp-1">
                                      {item.product ? (
                                        <Link href={`/products/${item.product.slug}`} className="hover:underline flex items-center gap-1">
                                          {item.product.name}
                                          <ExternalLink className="h-3 w-3 text-muted-foreground inline" />
                                        </Link>
                                      ) : (
                                        'Unknown Garment'
                                      )}
                                    </h4>
                                    <span className="text-xs font-bold text-white font-mono">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-x-4 text-[10px] font-mono text-muted-foreground mt-1">
                                    <span>Qty: <strong className="text-zinc-300">{item.quantity}</strong></span>
                                    {item.size && <span>Size: <strong className="text-zinc-300">{item.size}</strong></span>}
                                    {item.color && <span>Color: <strong className="text-zinc-300">{item.color}</strong></span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Shipping address info */}
                          <div className="md:col-span-4 bg-[#0d0d11]/50 border border-border/60 p-3.5 rounded text-[11px] font-mono">
                            <h4 className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold border-b border-border/60 pb-1.5 mb-2.5 flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-white" />
                              Delivery Destination
                            </h4>
                            <div className="text-muted-foreground space-y-1">
                              <p className="font-semibold text-white">{order.shipping_address.name}</p>
                              <p>{order.shipping_address.line1}</p>
                              {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                              <p>{order.shipping_address.country}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
