'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database.types';

interface AuthContextType {
  user: any; // Mapped Auth0 user (contains id, email, etc.)
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email?: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email?: string, password?: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyLoginOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextConsumer({ children }: { children: React.ReactNode }) {
  const {
    user: auth0User,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const mappedUser = auth0User ? {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    user_metadata: {
      full_name: auth0User.name || '',
    }
  } : null;

  useEffect(() => {
    const syncProfile = async () => {
      if (!auth0User || !auth0User.sub) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      const uid = auth0User.sub;
      const email = auth0User.email || '';
      const name = auth0User.name || '';

      if (!supabase) {
        setProfileLoading(false);
        return;
      }

      try {
        // Fetch or create profile in Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profile not found, let's create it!
          const isFirstAdmin = email === 'admin@zelix.com';
          const newProfile = {
            id: uid,
            email: email,
            full_name: name || email.split('@')[0],
            role: isFirstAdmin ? 'admin' : 'customer',
            created_at: new Date().toISOString()
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(insertedData as Profile);
        } else if (error) {
          throw error;
        } else {
          setProfile(data as Profile);
        }
      } catch (err) {
        console.error('Error syncing profile with Auth0:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!auth0Loading) {
      syncProfile();
    }
  }, [auth0User, auth0Loading]);

  const signIn = async () => {
    try {
      await loginWithRedirect();
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signUp = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        }
      });
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } });
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  // Safe placeholders to maintain backward compatibility
  const resetPassword = async () => ({ error: new Error('Password reset is managed in Auth0.') });
  const updatePassword = async () => ({ error: new Error('Password updates are managed in Auth0.') });
  const signInWithGoogle = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
        }
      });
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };
  const verifyEmailOtp = async () => ({ error: null });
  const signInWithOtp = async () => ({ error: null });
  const verifyLoginOtp = async () => ({ error: null });

  const isLoading = auth0Loading || profileLoading;
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';

  const isConfigured = domain && clientId && 
                       domain !== 'your-auth0-domain.auth0.com' && 
                       clientId !== 'your-auth0-client-id';

  if (!isConfigured) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          profile: null,
          isLoading: false,
          isAdmin: false,
          signIn: async () => ({ error: new Error('Auth0 domain/client ID not configured in .env.local') }),
          signUp: async () => ({ error: new Error('Auth0 domain/client ID not configured in .env.local') }),
          signOut: async () => ({ error: null }),
          resetPassword: async () => ({ error: null }),
          updatePassword: async () => ({ error: null }),
          signInWithGoogle: async () => ({ error: null }),
          verifyEmailOtp: async () => ({ error: null }),
          signInWithOtp: async () => ({ error: null }),
          verifyLoginOtp: async () => ({ error: null }),
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <AuthContextConsumer>{children}</AuthContextConsumer>
    </Auth0Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
