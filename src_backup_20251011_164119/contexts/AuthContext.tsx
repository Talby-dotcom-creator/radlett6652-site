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
  const [profileLoading, setProfileLoading] = useState(false);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  const loadProfile = async (currentUser: User) => {
    try {
      setProfileLoading(true);
      setError(null);

      console.log(
        "🔄 AuthContext: Loading profile for user:",
        currentUser.email
      );
      const startTime = Date.now();
      const userProfile = await api.getMemberProfile(currentUser.id);
      const loadTime = Date.now() - startTime;

      console.log(
        `👤 AuthContext: Profile loaded in ${loadTime}ms:`,
        userProfile
          ? {
              id: userProfile.id,
              full_name: userProfile.full_name,
              status: userProfile.status,
            }
          : null
      );

      setProfile(userProfile);
      if (userProfile) {
        console.log("🔐 AuthContext: User status:", userProfile.status);
      }
    } catch (error) {
      console.error("Error in loadProfile:", error);
      setError(
        `Failed to load user profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log("🔄 AuthContext: Refreshing profile...");
      await loadProfile(user);
    }
  };

  const forceRefresh = async () => {
    if (user) {
      console.log(
        "🔄 AuthContext: Force refreshing profile and clearing cache..."
      );
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

        if (error) {
          console.error("Error getting session:", error);
          setError("Authentication error");
        } else if (session?.user && mounted) {
          console.log(
            "✅ AuthContext: Initial session found for:",
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
        console.error("Unexpected error getting session:", err);
        setError("Failed to authenticate");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return;

      try {
        console.log(
          "🔄 AuthContext: Auth state change:",
          event,
          session?.user?.email
        );
        setError(null);

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await loadProfile(session.user);

          if (session.user.user_metadata?.reset_required) {
            setNeedsPasswordReset(true);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setNeedsPasswordReset(false);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        } else if (event === "TOKEN_REFRESHED" && !session) {
          console.warn(
            "⚠️ AuthContext: Token refresh failed, redirecting to login"
          );
          window.location.href = "/login?expired=1";
        }
      } catch (err) {
        console.error("Error handling auth state change:", err);
        setError("Authentication error");
        window.location.href = "/login?expired=1";
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("👋 AuthContext: Starting sign out...");
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.warn("⚠️ AuthContext: No active session, skipping sign out");
        setUser(null);
        setProfile(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("✅ AuthContext: Sign out successful");
      setUser(null);
      setProfile(null);
      setNeedsPasswordReset(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");
    }
  };

  // Determine admin access — adjust as needed
  const isAdmin = profile?.status === "active";

  // 🧩 TEMPORARY GUEST MODE — allows site to render when no Supabase session exists
  const guestMode = !user && !loading;
  const guestUser = guestMode
    ? ({ id: "guest-dev", email: "guest@local.dev" } as User)
    : user;

  if (guestMode) {
    console.warn(
      "⚙️ AuthContext: Guest mode active — Supabase session not found."
    );
  }

  const contextValue: AuthContextType = {
    user: guestUser,
    profile,
    loading: false, // always false during dev to prevent blocking
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
