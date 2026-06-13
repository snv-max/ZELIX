'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, ShieldCheck, Mail, Key, Sparkles, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, isLoading, updatePassword } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/profile');
    }
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [user, profile, isLoading, router]);

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
        // Mock Update
        const mockUsers = JSON.parse(localStorage.getItem('zelix_mock_users') || '[]');
        const idx = mockUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
          mockUsers[idx].full_name = fullName;
          localStorage.setItem('zelix_mock_users', JSON.stringify(mockUsers));
        }
        
        const session = JSON.parse(localStorage.getItem('zelix_mock_session') || '{}');
        session.full_name = fullName;
        localStorage.setItem('zelix_mock_session', JSON.stringify(session));
        
        // Force reload session in AuthContext
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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-8 sm:mb-12 border-b border-border pb-6">
          MY ACCOUNT
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Info Card */}
          <div className="md:col-span-4 glass p-6 rounded border border-border flex flex-col items-center text-center">
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

          {/* Form Content */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Update Info Form */}
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

            {/* Password Update Form */}
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

            {/* System Info Box */}
            <div className="border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
              <span>
                Your session is fully secured with {isSupabaseConfigured ? 'Supabase authentic security layer.' : 'local browser-stored active sessions.'}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
