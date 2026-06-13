'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchCategories, fetchProducts } from '@/lib/data';
import { mockDb } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product, Category, Order, Profile } from '@/types/database.types';
import { LayoutDashboard, ShoppingBag, FolderOpen, ClipboardList, Users, ShieldAlert, Plus, Edit2, Trash2, CheckCircle2, Package, RefreshCw, BarChart2, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'customers'>('overview');

  // DB States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states (Products)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    images: '',
    category_id: '',
    inventory: 0,
    sizes: 'S, M, L, XL',
    colors: 'Black, White',
  });

  // Form states (Categories)
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Fetch all admin data
  const loadAdminData = React.useCallback(async () => {
    if (!user || !isAdmin) return;
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(cats);
      setProducts(prods);

      if (isSupabaseConfigured && supabase) {
        // Supabase fetches
        const { data: ords } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(ords as Order[] || []);

        const { data: custs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setCustomers(custs as Profile[] || []);
      } else {
        // Local storage mock fetches
        setOrders(mockDb.getOrders());
        const mockUsers = JSON.parse(localStorage.getItem('zelix_mock_users') || '[]');
        setCustomers(mockUsers);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    }
  }, [user, isAdmin, loadAdminData]);

  // Authorization Shield
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Authenticating admin session...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="max-w-md w-full border border-red-950/40 bg-red-950/5 p-10 rounded text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-red-400 mb-2">Access Denied</h2>
          <p className="text-sm text-red-300/80 mb-6">
            You do not possess the necessary admin authorization roles to view the administration console.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Categories CRUD handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory: Omit<Category, 'created_at'> = {
      id: 'cat-' + Math.random().toString(36).substr(2, 9),
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || null,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('categories').insert(newCategory);
        if (error) throw error;
      } else {
        mockDb.saveCategory({ ...newCategory, created_at: new Date().toISOString() });
      }
      setNewCatName('');
      setNewCatDesc('');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error adding category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will become unassigned.')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
      } else {
        mockDb.deleteCategory(id);
      }
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  // Products CRUD handlers
  const handleOpenProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.join(', '),
        category_id: product.category_id || '',
        inventory: product.inventory,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        images: '/products/hoodie.png', // default placeholder image
        category_id: categories[0]?.id || '',
        inventory: 20,
        sizes: 'S, M, L, XL',
        colors: 'Charcoal, Obsidian Black, Sand',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSizes = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const cleanColors = productForm.colors.split(',').map(c => c.trim()).filter(Boolean);
    const cleanImages = productForm.images.split(',').map(i => i.trim()).filter(Boolean);

    const slug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const productData: Omit<Product, 'created_at'> = {
      id: editingProduct ? editingProduct.id : 'prod-' + Math.random().toString(36).substr(2, 9),
      name: productForm.name,
      slug,
      description: productForm.description,
      price: Number(productForm.price),
      images: cleanImages.length > 0 ? cleanImages : ['/products/hoodie.png'],
      category_id: productForm.category_id,
      inventory: Number(productForm.inventory),
      sizes: cleanSizes,
      colors: cleanColors,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        if (editingProduct) {
          const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('products').insert(productData);
          if (error) throw error;
        }
      } else {
        mockDb.saveProduct({
          ...productData,
          created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
        });
      }
      setIsProductModalOpen(false);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } else {
        mockDb.deleteProduct(id);
      }
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (error) throw error;
      } else {
        mockDb.updateOrderStatus(orderId, status);
      }
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    }
  };

  // Overview metrics calculations
  const totalRevenue = orders.filter(o => o.status !== 'pending' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total_amount, 0);
  const outOfStockItems = products.filter(p => p.inventory === 0).length;

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title bar */}
        <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              ADMIN PANEL
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
              Store Manager Console // ZELIX Control Center
            </p>
          </div>
          <button 
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-card/60 hover:bg-white/5 rounded text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload Sync
          </button>
        </div>

        {/* Console Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tab Navigation Menu */}
          <nav className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Garments CRUD', icon: ShoppingBag },
              { id: 'categories', label: 'Categories', icon: FolderOpen },
              { id: 'orders', label: 'Global Orders', icon: ClipboardList },
              { id: 'customers', label: 'Customers', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm uppercase tracking-widest font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-black font-extrabold' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Admin Tab Contents */}
          <main className="lg:col-span-9 glass p-6 sm:p-8 rounded border border-border min-h-[500px]">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin mb-4" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Syncing metrics data...</span>
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-10">
                    
                    {/* Stats Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="border border-border/80 bg-zinc-950/20 p-5 rounded">
                        <div className="flex justify-between items-center text-muted-foreground mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest">Total Sales</span>
                          <DollarSign className="h-4 w-4 text-accent" />
                        </div>
                        <h3 className="text-2xl font-black text-white font-mono">₹{totalRevenue}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 mt-1.5 uppercase">Paid & Shipped Orders</p>
                      </div>

                      <div className="border border-border/80 bg-zinc-950/20 p-5 rounded">
                        <div className="flex justify-between items-center text-muted-foreground mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest">Total Orders</span>
                          <ClipboardList className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white font-mono">{orders.length}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 mt-1.5 uppercase">Purchases Checked Out</p>
                      </div>

                      <div className="border border-border/80 bg-zinc-950/20 p-5 rounded">
                        <div className="flex justify-between items-center text-muted-foreground mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest">Active Stock</span>
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white font-mono">{products.reduce((acc, p) => acc + p.inventory, 0)}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 mt-1.5 uppercase">Garments in Inventory</p>
                      </div>

                      <div className="border border-border/80 bg-zinc-950/20 p-5 rounded">
                        <div className="flex justify-between items-center text-muted-foreground mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest">Low Stock Alert</span>
                          <AlertTriangle className={`h-4 w-4 ${outOfStockItems > 0 ? 'text-error animate-pulse' : 'text-zinc-500'}`} />
                        </div>
                        <h3 className="text-2xl font-black text-white font-mono">{outOfStockItems}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 mt-1.5 uppercase">Items Sold Out</p>
                      </div>

                    </div>

                    {/* Sales SVG Line Chart */}
                    <div className="border border-border bg-zinc-950/30 p-6 rounded">
                      <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
                        <BarChart2 className="h-4.5 w-4.5 text-accent" />
                        <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">Revenue Timeline (Monthly Target)</h4>
                      </div>
                      
                      {/* Bespoke SVG Line Area Graph */}
                      <div className="relative w-full h-64 bg-zinc-950/50 rounded border border-border/50 p-2 overflow-hidden flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          <line x1="0" y1="37" x2="500" y2="37" stroke="#1f1f29" strokeWidth="0.5" strokeDasharray="4 4" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="#1f1f29" strokeWidth="0.5" strokeDasharray="4 4" />
                          <line x1="0" y1="112" x2="500" y2="112" stroke="#1f1f29" strokeWidth="0.5" strokeDasharray="4 4" />
                          
                          {/* Fill Area */}
                          <path 
                            d="M 0 150 L 0 110 L 80 120 L 160 85 L 240 90 L 320 60 L 400 45 L 500 20 L 500 150 Z" 
                            fill="url(#chartGradient)" 
                          />
                          {/* Curve Path Line */}
                          <path 
                            d="M 0 110 Q 40 125 80 120 T 160 85 T 240 90 T 320 60 T 400 45 T 500 20" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                          />
                          {/* Data points */}
                          <circle cx="80" cy="120" r="4.5" fill="#d4af37" stroke="#000000" strokeWidth="1" />
                          <circle cx="160" cy="85" r="4.5" fill="#d4af37" stroke="#000000" strokeWidth="1" />
                          <circle cx="240" cy="90" r="4.5" fill="#d4af37" stroke="#000000" strokeWidth="1" />
                          <circle cx="320" cy="60" r="4.5" fill="#d4af37" stroke="#000000" strokeWidth="1" />
                          <circle cx="400" cy="45" r="4.5" fill="#d4af37" stroke="#000000" strokeWidth="1" />
                          <circle cx="500" cy="20" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1" className="animate-pulse" />
                        </svg>

                        {/* Chart details */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>+24.5% Growth</span>
                        </div>
                      </div>

                      {/* Timeline labels */}
                      <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-3 px-2">
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May (Active)</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. PRODUCTS CRUD TAB */}
                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">Catalog Management</h3>
                      <button 
                        onClick={() => handleOpenProductModal()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add Product
                      </button>
                    </div>

                    {/* Products Grid list table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border/80 text-[10px] font-mono uppercase text-muted-foreground">
                            <th className="py-3 px-2">Garment</th>
                            <th className="py-3 px-2">Category</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2">Stock</th>
                            <th className="py-3 px-2">Variants</th>
                            <th className="py-3 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {products.map((prod) => {
                            const cat = categories.find(c => c.id === prod.category_id);
                            return (
                              <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3.5 px-2 font-bold text-white max-w-[180px] truncate">{prod.name}</td>
                                <td className="py-3.5 px-2 text-muted-foreground text-xs uppercase tracking-wider">{cat?.name || 'Unassigned'}</td>
                                <td className="py-3.5 px-2 font-mono text-white">₹{prod.price}</td>
                                <td className="py-3.5 px-2 font-mono">
                                  <span className={prod.inventory === 0 ? 'text-error font-bold' : prod.inventory < 10 ? 'text-accent font-bold animate-pulse' : 'text-zinc-300'}>
                                    {prod.inventory} pcs
                                  </span>
                                </td>
                                <td className="py-3.5 px-2 text-[10px] font-mono text-muted-foreground">{prod.sizes.join(', ')}</td>
                                <td className="py-3.5 px-2 text-right space-x-1.5">
                                  <button 
                                    onClick={() => handleOpenProductModal(prod)}
                                    className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                                    aria-label="Edit product"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    className="p-1.5 text-zinc-600 hover:text-error transition-colors"
                                    aria-label="Delete product"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. CATEGORIES TAB */}
                {activeTab === 'categories' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Add Category Form */}
                    <div className="md:col-span-5 border border-border p-5 rounded bg-zinc-950/20">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold mb-4 border-b border-border pb-2">
                        Create Category
                      </h3>
                      
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Category Name</label>
                          <input 
                            type="text" 
                            required 
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="e.g. Outerwear"
                            className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
                          <textarea 
                            rows={3}
                            value={newCatDesc}
                            onChange={(e) => setNewCatDesc(e.target.value)}
                            placeholder="Brief description..."
                            className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full inline-flex items-center justify-center bg-white text-black font-bold text-xs uppercase tracking-widest rounded py-3 hover:bg-zinc-200 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create
                        </button>
                      </form>
                    </div>

                    {/* Categories table list */}
                    <div className="md:col-span-7 space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold mb-4 pb-2 border-b border-border/80">
                        Existing Categories
                      </h3>

                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id} 
                            className="flex justify-between items-center p-4 rounded bg-[#0d0d11]/80 border border-border/80 hover:border-white/20 transition-all"
                          >
                            <div>
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{cat.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 leading-normal">{cat.description || 'No description provided'}</p>
                            </div>
                            
                            <button 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-2 text-zinc-600 hover:text-error transition-colors"
                              aria-label="Delete Category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. GLOBAL ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold mb-6 pb-2 border-b border-border/80">
                      Global Purchase Orders
                    </h3>

                    {orders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No orders logged in store records.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((ord) => {
                          const cust = customers.find(c => c.id === ord.user_id);
                          return (
                            <div 
                              key={ord.id} 
                              className="border border-border/85 p-5 rounded bg-[#0d0d11]/85 space-y-4"
                            >
                              {/* Summary bar */}
                              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground">
                                <div className="flex gap-4">
                                  <span>ID: <strong className="text-white">{ord.id.substring(0, 8)}...</strong></span>
                                  <span>Customer: <strong className="text-white">{cust?.full_name || ord.shipping_address.name || 'Anonymous'}</strong></span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-white font-bold">₹{ord.total_amount}</span>
                                  
                                  {/* Change status dropdown */}
                                  <select
                                    value={ord.status}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                                    className="bg-zinc-950 border border-border text-[10px] font-mono font-bold text-white rounded px-2 py-1 focus:outline-none cursor-pointer"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>

                              {/* Shipping summary */}
                              <p className="text-xs text-muted-foreground font-sans">
                                <strong>Ship to:</strong> {ord.shipping_address.name} — {ord.shipping_address.line1}, {ord.shipping_address.city}, {ord.shipping_address.state} {ord.shipping_address.postal_code}, {ord.shipping_address.country}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. CUSTOMERS TAB */}
                {activeTab === 'customers' && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold mb-6 pb-2 border-b border-border/80">
                      User Accounts Directory
                    </h3>

                    <div className="space-y-3">
                      {customers.map((cust) => (
                        <div 
                          key={cust.id}
                          className="flex items-center justify-between p-4 rounded bg-[#0d0d11]/85 border border-border/80"
                        >
                          <div className="truncate pr-4">
                            <h4 className="text-sm font-bold text-white truncate">{cust.full_name || 'No Name'}</h4>
                            <p className="text-xs text-muted-foreground font-mono truncate">{cust.email}</p>
                          </div>
                          
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black bg-white px-2 py-0.5 rounded">
                            {cust.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

        </div>

      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" style={{ animationDuration: '0.2s' }}>
          <div className="max-w-2xl w-full bg-[#0d0d11] border border-border rounded-lg p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="text-base font-bold uppercase tracking-widest text-white">
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Garment Name</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ZELIX Premium Parka"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Category</label>
                  <select 
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Price (₹ INR)</label>
                  <input 
                    type="number" 
                    required 
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Initial Inventory (Qty)</label>
                  <input 
                    type="number" 
                    required 
                    min={0}
                    value={productForm.inventory}
                    onChange={(e) => setProductForm(prev => ({ ...prev, inventory: Number(e.target.value) }))}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Description Details</label>
                <textarea 
                  rows={4}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Fabric composition, weight, tailoring cuts..."
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors animate-fade-in"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Image URLs (comma separated)</label>
                <input 
                  type="text" 
                  value={productForm.images}
                  onChange={(e) => setProductForm(prev => ({ ...prev, images: e.target.value }))}
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
                <p className="text-[9px] text-muted-foreground font-mono mt-1">E.g. /products/hoodie.png, /products/cargo.png</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Available Sizes (comma separated)</label>
                  <input 
                    type="text" 
                    value={productForm.sizes}
                    onChange={(e) => setProductForm(prev => ({ ...prev, sizes: e.target.value }))}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Available Colors (comma separated)</label>
                  <input 
                    type="text" 
                    value={productForm.colors}
                    onChange={(e) => setProductForm(prev => ({ ...prev, colors: e.target.value }))}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded py-4 hover:bg-zinc-200 transition-colors cursor-pointer mt-4"
              >
                <CheckCircle2 className="h-4.5 w-4.5 mr-1" />
                Save Garment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
