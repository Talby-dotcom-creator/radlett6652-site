// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { MemberProfile } from "../types";
import { optimizedApi as api } from "../lib/optimizedApi";

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | null;
  loading: boolean;
  isAdmin: boolean;
  needsPasswordReset?: boolean;
  signOut: () => Promise<void>;
  refreshProfile?: () => Promise<void>;
  forceRefresh?: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  needsPasswordReset: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  // ---------------------------------------------------------------------------
  // 🔍 Load member profile from Supabase
  // ---------------------------------------------------------------------------
  const loadProfile = async (user: User) => {
    try {
      if (import.meta.env.DEV) console.log("Loading member profile");
      const prof = await api.getMemberProfile(user.id);

      if (prof) {
        if (import.meta.env.DEV) console.log("Member profile loaded");
        setProfile(prof);
      } else {
        if (import.meta.env.DEV) console.warn("No member profile found");
        setProfile(null);
      }
    } catch (err: any) {
      console.error("💥 Error loading profile:", err.message);
      setProfile(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 🧠 Initialize session once on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (import.meta.env.DEV) console.log("Auth context mounted");
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        if (import.meta.env.DEV) console.log("Loading initial session");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // ✅ Detect temporary password state
          const pwReset = !!currentUser?.app_metadata?.provider_token;
          setNeedsPasswordReset(pwReset);

          // ✅ Load the profile asynchronously
          setTimeout(() => loadProfile(currentUser), 0);
        } else {
          setProfile(null);
          setNeedsPasswordReset(false);
        }
      } catch (err: any) {
        console.error("❌ Error in getInitialSession:", err.message);
        setUser(null);
        setProfile(null);
        setNeedsPasswordReset(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // -------------------------------------------------------------------------
    // 🔄 Subscribe to auth state changes
    // -------------------------------------------------------------------------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (import.meta.env.DEV) console.log("Authentication state changed", event);

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const pwReset = event === "PASSWORD_RECOVERY";
        setNeedsPasswordReset(pwReset);
        setTimeout(() => loadProfile(currentUser), 0);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setNeedsPasswordReset(false);
      }

      setLoading(false);
    });

    return () => {
      if (import.meta.env.DEV) console.log("Auth context cleanup");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 🚪 Sign out logic
  // ---------------------------------------------------------------------------
  const signOut = async () => {
    if (import.meta.env.DEV) console.log("Signing out");
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setNeedsPasswordReset(false);
      if (import.meta.env.DEV) console.log("Signed out successfully");
    } catch (err: any) {
      console.error("❌ Error signing out:", err.message);
    }
  };

  // Allow manual profile refresh from callers (used in some admin/dev pages)
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  // Force a reload cycle (sets loading and re-fetches profile if possible)
  const forceRefresh = () => {
    setLoading(true);
    if (user) {
      loadProfile(user).finally(() => setLoading(false));
    } else {
      setProfile(null);
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        needsPasswordReset,
        signOut,
        refreshProfile,
        forceRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
