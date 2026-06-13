'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types/database.types';
import { MOCK_ADMIN_USER, MOCK_CUSTOMER_USER } from '@/lib/mockData';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | { id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Mock User helper
  const loadMockUser = (email: string) => {
    if (email === MOCK_ADMIN_USER.email) {
      setUser({ id: MOCK_ADMIN_USER.id, email: MOCK_ADMIN_USER.email });
      setProfile(MOCK_ADMIN_USER);
      localStorage.setItem('zelix_mock_session', JSON.stringify(MOCK_ADMIN_USER));
    } else {
      // Find or create in local users list
      const mockUsers = JSON.parse(localStorage.getItem('zelix_mock_users') || '[]');
      let existing = mockUsers.find((u: Profile) => u.email === email);
      if (!existing) {
        existing = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          email: email,
          full_name: email.split('@')[0],
          avatar_url: null,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        mockUsers.push(existing);
        localStorage.setItem('zelix_mock_users', JSON.stringify(mockUsers));
      }
      setUser({ id: existing.id, email: existing.email });
      setProfile(existing);
      localStorage.setItem('zelix_mock_session', JSON.stringify(existing));
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Supabase Authentication Setup
      const fetchProfile = async (uid: string) => {
        try {
          const { data, error } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .single();

          if (error) throw error;
          setProfile(data as Profile);
        } catch (err) {
          console.error('Error loading Supabase profile:', err);
          // Fallback just in case profile isn't generated yet
          setProfile({
            id: uid,
            email: user?.email || '',
            full_name: '',
            avatar_url: null,
            role: 'customer',
            created_at: new Date().toISOString(),
          });
        }
      };

      const getSession = async () => {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      };

      getSession();

      const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Mock Authentication Setup
      if (typeof window !== 'undefined') {
        const activeSession = localStorage.getItem('zelix_mock_session');
        if (activeSession) {
          const prof = JSON.parse(activeSession) as Profile;
          setUser({ id: prof.id, email: prof.email });
          setProfile(prof);
        }
      }
      setIsLoading(false);
    }
  }, [user?.email]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Mock authentication success
        loadMockUser(email);
      }
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
      if (isSupabaseConfigured && supabase) {
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
      } else {
        // Mock Register
        const mockUsers = JSON.parse(localStorage.getItem('zelix_mock_users') || '[]');
        const existing = mockUsers.find((u: Profile) => u.email === email);
        if (existing) {
          throw new Error('User already exists');
        }

        // Determine if first user ever (make admin for local ease)
        const isFirst = mockUsers.length === 0 && email !== MOCK_ADMIN_USER.email;

        const newProfile: Profile = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          email: email,
          full_name: fullName,
          avatar_url: null,
          role: isFirst ? 'admin' : 'customer',
          created_at: new Date().toISOString(),
        };

        mockUsers.push(newProfile);
        localStorage.setItem('zelix_mock_users', JSON.stringify(mockUsers));
        setUser({ id: newProfile.id, email: newProfile.email });
        setProfile(newProfile);
        localStorage.setItem('zelix_mock_session', JSON.stringify(newProfile));
      }
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
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase!.auth.signOut();
        if (error) throw error;
      } else {
        localStorage.removeItem('zelix_mock_session');
      }
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
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase!.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) throw error;
      } else {
        console.log(`Mock reset password email requested for: ${email}`);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const updatePassword = async (password: string): Promise<{ error: Error | null }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase!.auth.updateUser({ password });
        if (error) throw error;
      } else {
        console.log(`Mock password update successfully updated to: ${password}`);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase!.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
      } else {
        // Mock Google login
        loadMockUser(MOCK_CUSTOMER_USER.email);
      }
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
