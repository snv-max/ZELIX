'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider as ClerkOriginalProvider, useUser as useClerkUser, useClerk as useClerkOriginal, useAuth as useClerkAuth } from '@clerk/nextjs';

export const isClerkConfigured = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('...');

// Define types for our custom context
interface MockUser {
  id: string;
  fullName: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  publicMetadata: {
    role: 'customer' | 'admin';
  };
  update: (data: { firstName: string; lastName: string }) => Promise<void>;
}

interface CustomAuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  userId: string | null;
  user: MockUser | null;
  signOut: () => Promise<void>;
  signInMock: (email: string, role: 'customer' | 'admin') => void;
}

const CustomAuthContext = createContext<CustomAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // If Clerk is configured, we wrap in the real ClerkProvider and bypass our mock state
  if (isClerkConfigured) {
    return (
      <ClerkOriginalProvider>
        {children}
      </ClerkOriginalProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}

// Internal mock provider
function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load mock user session from localStorage
    const savedUserId = localStorage.getItem('zelix_mock_user_id');
    const savedEmail = localStorage.getItem('zelix_mock_email');
    const savedRole = localStorage.getItem('zelix_mock_role') as any;
    const savedName = localStorage.getItem('zelix_mock_name') || 'Zelix Member';

    if (savedUserId && savedEmail && savedRole) {
      setUser({
        id: savedUserId,
        fullName: savedName,
        primaryEmailAddress: { emailAddress: savedEmail },
        publicMetadata: { role: savedRole },
        update: async (data: { firstName: string; lastName: string }) => {
          const newName = `${data.firstName} ${data.lastName}`.trim();
          localStorage.setItem('zelix_mock_name', newName);
          setUser(prev => prev ? { ...prev, fullName: newName } : null);
        }
      });
    }
    setIsLoaded(true);
  }, []);

  const signInMock = (email: string, role: 'customer' | 'admin') => {
    const userId = 'mock_usr_' + Math.random().toString(36).substr(2, 9);
    const fullName = email === 'admin@zelix.com' ? 'Zelix Administrator' : 'Zelix Customer';
    
    localStorage.setItem('zelix_mock_user_id', userId);
    localStorage.setItem('zelix_mock_email', email);
    localStorage.setItem('zelix_mock_role', role);
    localStorage.setItem('zelix_mock_name', fullName);
    
    // Set cookies for middleware
    document.cookie = `zelix_mock_user_id=${userId}; path=/; max-age=31536000`;
    document.cookie = `zelix_mock_role=${role}; path=/; max-age=31536000`;

    setUser({
      id: userId,
      fullName,
      primaryEmailAddress: { emailAddress: email },
      publicMetadata: { role },
      update: async (data: { firstName: string; lastName: string }) => {
        const newName = `${data.firstName} ${data.lastName}`.trim();
        localStorage.setItem('zelix_mock_name', newName);
        setUser(prev => prev ? { ...prev, fullName: newName } : null);
      }
    });
  };

  const signOut = async () => {
    localStorage.removeItem('zelix_mock_user_id');
    localStorage.removeItem('zelix_mock_email');
    localStorage.removeItem('zelix_mock_role');
    localStorage.removeItem('zelix_mock_name');
    
    // Clear cookies
    document.cookie = 'zelix_mock_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'zelix_mock_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
  };

  const isSignedIn = !!user;

  return (
    <CustomAuthContext.Provider value={{
      isSignedIn,
      isLoaded,
      userId: user?.id || null,
      user,
      signOut,
      signInMock
    }}>
      {children}
    </CustomAuthContext.Provider>
  );
}

// Custom hook wrappers that toggle between Clerk and Mock
export function useUser() {
  if (isClerkConfigured) {
    return useClerkUser() as any;
  }
  
  const context = useContext(CustomAuthContext);
  if (!context) throw new Error('useUser must be used within AuthProvider');
  
  return {
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
    user: context.user,
  };
}

export function useClerk() {
  if (isClerkConfigured) {
    return useClerkOriginal() as any;
  }
  
  const context = useContext(CustomAuthContext);
  if (!context) throw new Error('useClerk must be used within AuthProvider');
  
  return {
    signOut: context.signOut,
  };
}

export function useAuth() {
  if (isClerkConfigured) {
    return useClerkAuth() as any;
  }
  
  const context = useContext(CustomAuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  
  return {
    userId: context.userId,
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
  };
}

export function useMockAuthHelper() {
  const context = useContext(CustomAuthContext);
  return context || null;
}
