'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, ShieldCheck, Mail, Key, Sparkles, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    async function checkAndSyncProfile() {
      if (!user) return;
      const uid = user.id;
      const email = user.primaryEmailAddress?.emailAddress || '';
      const name = user.fullName || email.split('@')[0];

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .single();

          if (error && error.code === 'PGRST116') {
            // Not found: create it
            const isFirstAdmin = email === 'admin@zelix.com' || user.publicMetadata?.role === 'admin';
            const newProfile = {
              id: uid,
              email: email,
              full_name: name,
              role: isFirstAdmin ? 'admin' : 'customer',
              created_at: new Date().toISOString()
            };
            const { data: insertedData, error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (insertError) throw insertError;
            setFullName(insertedData.full_name || '');
          } else if (error) {
            throw error;
          } else {
            setFullName(data.full_name || '');
          }
        } catch (err) {
          console.error('Error syncing Clerk user to Supabase profiles:', err);
        }
      } else {
        setFullName(name);
      }
    }

    if (isLoaded && user) {
      checkAndSyncProfile();
    }
  }, [user, isLoaded]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      // 1. Update Clerk user profile names
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      await user.update({ firstName, lastName });

      // 2. Update Supabase profile
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user.id);
        if (error) throw error;
      }
      
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  const userEmail = user.primaryEmailAddress?.emailAddress || '';

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-8 sm:mb-12 border-b border-border pb-6">
          PROFILE SETTINGS
        </h1>

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
                    value={userEmail}
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

          {/* Security Managed by Clerk Box */}
          <div className="glass p-6 rounded border border-border">
            <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
              <Key className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-sm font-mono uppercase tracking-widest text-white font-bold">Security</h3>
            </div>
            
            <div className="p-4 rounded border border-border/60 bg-white/5 text-xs text-muted-foreground leading-relaxed font-mono">
              Authentication security configurations (such as updating passwords, setting up Multi-Factor Authentication, and updating recovery details) are managed off-site via Clerk Identity Services.
            </div>
          </div>

          {/* System Info */}
          <div className="border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
            <span>
              Your session is secured with Clerk Authentication.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
