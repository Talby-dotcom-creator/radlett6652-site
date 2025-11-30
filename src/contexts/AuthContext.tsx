// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);
  const navigate = useNavigate();

  const loadProfile = async (current: User) => {
    try {
      let prof = await api.getMemberProfile(current.id);

      // Backfill missing name with email prefix to avoid blanks
      if (prof && (!prof.full_name || !prof.full_name.trim()) && current.email) {
        const fallbackName = current.email.split("@")[0] || "Member";
        try {
          await api.updateMemberProfile(current.id, {
            full_name: fallbackName,
            status: prof.status ?? "active",
          });
          prof = { ...prof, full_name: fallbackName, status: "active" };
        } catch (err) {
          console.warn("Could not backfill full_name:", err);
        }
      }

      setProfile(prof ?? null);
    } catch (err: any) {
      console.error("Error loading profile:", err.message);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const pwReset = !!currentUser?.app_metadata?.provider_token;
          setNeedsPasswordReset(pwReset);
          setTimeout(() => loadProfile(currentUser), 0);
        } else {
          setProfile(null);
          setNeedsPasswordReset(false);
        }
      } catch (err: any) {
        console.error("Error in getInitialSession:", err.message);
        setUser(null);
        setProfile(null);
        setNeedsPasswordReset(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setNeedsPasswordReset(false);
    } catch (err: any) {
      console.error("Error signing out:", err.message);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === "admin",
        needsPasswordReset,
        signOut,
        refreshProfile,
        forceRefresh: refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

