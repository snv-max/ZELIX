'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '@/types/database.types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockDb } from '@/lib/mockData';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity: number, size: string | null, color: string | null) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const wishlistMountedRef = useRef(true);

  // 1. Load Cart from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('zelix_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // 2. Load Wishlist on mount or when user changes
  useEffect(() => {
    wishlistMountedRef.current = true;

    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('wishlists')
            .select('product_id, products(*)')
            .eq('user_id', user.id);

          if (!wishlistMountedRef.current) return;
          if (error) throw error;
          const items = data
            ?.map((item: any) => item.products as Product)
            .filter(Boolean) || [];
          setWishlist(items);
        } catch (err: any) {
          if (!wishlistMountedRef.current) return;
          const msg = err?.message || '';
          if (msg.includes('aborted') || err?.name === 'AbortError') return;
          console.error('Error loading Supabase wishlist:', err);
          setWishlist(mockDb.getWishlist(user.id));
        }
      } else {
        if (wishlistMountedRef.current) {
          setWishlist(mockDb.getWishlist(user.id));
        }
      }
    };

    loadWishlist();

    return () => {
      wishlistMountedRef.current = false;
    };
  }, [user]);

  // Save Cart to LocalStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('zelix_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number, size: string | null, color: string | null) => {
    const cartItemId = `${product.id}-${size || 'OS'}-${color || 'Default'}`;
    const newCart = [...cart];
    const index = newCart.findIndex(item => item.id === cartItemId);

    if (index >= 0) {
      newCart[index].quantity += quantity;
    } else {
      newCart.push({
        id: cartItemId,
        product,
        quantity,
        size,
        color,
      });
    }
    saveCart(newCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter(item => item.id !== cartItemId);
    saveCart(newCart);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    const newCart = cart.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      // Must be logged in to wishlist, trigger visual alert or redirect
      alert('Please log in to save items to your wishlist.');
      return;
    }

    // Optimistic update
    const inWishlist = wishlist.some(p => p.id === product.id);
    let newWishlist = [...wishlist];

    if (inWishlist) {
      newWishlist = newWishlist.filter(p => p.id !== product.id);
    } else {
      newWishlist.push(product);
    }
    setWishlist(newWishlist);

    // Sync database
    if (isSupabaseConfigured && supabase) {
      try {
        if (inWishlist) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product.id);
        } else {
          await supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id: product.id });
        }
      } catch (err) {
        console.error('Error syncing wishlist with Supabase:', err);
        mockDb.toggleWishlist(user.id, product.id);
      }
    } else {
      mockDb.toggleWishlist(user.id, product.id);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
