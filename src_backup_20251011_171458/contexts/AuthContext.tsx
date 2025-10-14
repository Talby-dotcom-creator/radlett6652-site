// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { MemberProfile } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  needsPasswordReset?: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  error: null,
  refreshProfile: async () => {},
  forceRefresh: async () => {},
  needsPasswordReset: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  const loadProfile = async (currentUser: User) => {
    try {
      const startTime = Date.now();
      const userProfile = await api.getMemberProfile(currentUser.id);
      const loadTime = Date.now() - startTime;

      console.log(
        `👤 AuthContext: Profile loaded in ${loadTime}ms`,
        userProfile?.full_name ?? "No profile found"
      );

      setProfile(userProfile);
    } catch (err) {
      console.error("Error in loadProfile:", err);
      setError("Failed to load user profile");
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user);
  };

  const forceRefresh = async () => {
    if (user) {
      setProfile(null);
      await loadProfile(user);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log("🚀 AuthContext: Getting initial session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user && mounted) {
          console.log(
            "✅ AuthContext: Initial session found:",
            session.user.email
          );
          setUser(session.user);
          await loadProfile(session.user);

          if (session.user.user_metadata?.reset_required) {
            setNeedsPasswordReset(true);
          }
        } else {
          console.log("ℹ️ AuthContext: No initial session found");
        }
      } catch (err) {
        console.error("AuthContext: Error getting session:", err);
        setError("Failed to authenticate");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log(
        "🔄 AuthContext: Auth state change:",
        event,
        session?.user?.email
      );

      try {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        }
      } catch (err) {
        console.error("AuthContext: Auth state handler error:", err);
        setError("Authentication error");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("👋 AuthContext: Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out");
    }
  };

  // Determine admin access
  const isAdmin = profile?.status === "active";

  // 🌍 Enable guest mode only on localhost
  const isLocalhost = window.location.hostname.includes("localhost");
  const guestMode = !user && !loading && isLocalhost;

  const guestUser = guestMode
    ? ({ id: "guest-dev", email: "guest@local.dev" } as User)
    : user;

  if (guestMode) {
    console.warn("⚙️ AuthContext: Guest mode active — local development only.");
  }

  const contextValue: AuthContextType = {
    user: guestUser,
    profile,
    loading: false,
    signOut,
    isAdmin,
    error,
    refreshProfile,
    forceRefresh,
    needsPasswordReset,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
