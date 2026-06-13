'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database.types';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyLoginOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track whether the component is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!supabase) {
      console.warn('Supabase client is not initialized.');
      setIsLoading(false);
      return;
    }

    let subscription: any = null;

    const fetchProfile = async (uid: string, userEmail: string) => {
      if (!mountedRef.current) return;
      try {
        const { data, error } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();

        if (!mountedRef.current) return;
        if (error) throw error;
        setProfile(data as Profile);
      } catch (err: any) {
        if (!mountedRef.current) return;
        // Suppress "signal aborted" noise — these are harmless cleanup aborts
        const msg = err?.message || '';
        if (msg.includes('aborted') || err?.name === 'AbortError') return;
        console.error('Error loading Supabase profile:', err);
        // Fail-secure fallback (customer role, no admin bypass)
        setProfile({
          id: uid,
          email: userEmail,
          full_name: '',
          avatar_url: null,
          role: 'customer',
          created_at: new Date().toISOString(),
        });
      }
    };

    // getSession is the authoritative source of truth on initial load.
    // We let onAuthStateChange handle all subsequent updates.
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (!mountedRef.current) return;
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err: any) {
        if (!mountedRef.current) return;
        const msg = err?.message || '';
        if (!msg.includes('aborted') && err?.name !== 'AbortError') {
          console.error('Failed to get Supabase session:', err);
        }
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    getSession();

    try {
      const { data } = supabase!.auth.onAuthStateChange(async (event, session) => {
        // INITIAL_SESSION is already handled by getSession() above — skip to avoid double fetch
        if (event === 'INITIAL_SESSION') return;

        try {
          if (!mountedRef.current) return;
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id, session.user.email || '');
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (innerErr: any) {
          if (!mountedRef.current) return;
          const msg = innerErr?.message || '';
          if (!msg.includes('aborted') && innerErr?.name !== 'AbortError') {
            console.error('Error inside onAuthStateChange handler:', innerErr);
          }
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      });
      subscription = data?.subscription;
    } catch (err) {
      console.error('Failed to register onAuthStateChange listener:', err);
      if (mountedRef.current) setIsLoading(false);
    }

    return () => {
      mountedRef.current = false;
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch {
          // Silently ignore unsubscribe errors during cleanup
        }
      }
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOtp = async (email: string, token: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOtp = async (email: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginOtp = async (email: string, token: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const updatePassword = async (password: string): Promise<{ error: Error | null }> => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.updateUser({ password });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        signInWithGoogle,
        verifyEmailOtp,
        signInWithOtp,
        verifyLoginOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
