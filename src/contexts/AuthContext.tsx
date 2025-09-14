import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { MemberProfile } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  needsPasswordReset: boolean;
  forceRefresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  error: null,
  refreshProfile: async () => {},
  needsPasswordReset: false,
  forceRefresh: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = async (currentUser: User) => {
    try {
      setProfileLoading(true);
      setError(null);
      console.log('🔄 AuthContext: Loading profile for user:', currentUser.email);
      const startTime = Date.now();
      
      const userProfile = await api.getMemberProfile(currentUser.id);
      const loadTime = Date.now() - startTime;
      console.log(`👤 AuthContext: Profile loaded in ${loadTime}ms:`, userProfile ? {
        id: userProfile.id,
        full_name: userProfile.full_name,
        role: userProfile.role,
        status: userProfile.status
      } : null);
      setProfile(userProfile);
      
      // Log admin status for debugging
      if (userProfile) {
        console.log('🔐 AuthContext: User role:', userProfile.role);
        console.log('🔐 AuthContext: User status:', userProfile.status);
        console.log('🔐 AuthContext: Is admin:', userProfile.role === 'admin');
        console.log('🔐 AuthContext: Is active admin:', userProfile.role === 'admin' && userProfile.status === 'active');
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      setError(`Failed to load user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 AuthContext: Refreshing profile...');
      await loadProfile(user);
    }
  };

  const forceRefresh = async () => {
    if (user) {
      console.log('🔄 AuthContext: Force refreshing profile and clearing cache...');
      // Clear any cached profile data
      setProfile(null);
      await loadProfile(user);
    }
  };
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🚀 AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Authentication error');
        } else if (session?.user && mounted) {
          console.log('✅ AuthContext: Initial session found for:', session.user.email);
          setUser(session.user);
          await loadProfile(session.user);
        } else {
          console.log('ℹ️ AuthContext: No initial session found');
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err);
        setError('Failed to authenticate');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Start the initial session check
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      try {
        console.log('🔄 AuthContext: Auth state change:', event, session?.user?.email);
        setError(null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: User signed in:', session.user.email);
          setUser(session.user);
          await loadProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 AuthContext: User signed out');
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 AuthContext: Token refreshed for:', session.user.email);
          setUser(session.user);
          // Reload profile on token refresh to ensure we have latest data
          await loadProfile(session.user);
        }
      } catch (err) {
        console.error('Error handling auth state change:', err);
        setError('Authentication error');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('👋 AuthContext: Starting sign out...');
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ AuthContext: Sign out successful');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin' && profile?.status === 'active';

  const needsPasswordReset = profile?.needs_password_reset === true;

  const contextValue = { 
    user, 
    profile, 
    loading: loading || profileLoading, 
    signOut, 
    isAdmin, 
    error,
    refreshProfile,
    needsPasswordReset,
    forceRefresh
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};