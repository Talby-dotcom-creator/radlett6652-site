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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🚀 Load member profile safely
  const loadProfile = async (user: User) => {
    try {
      console.log("🔍 loadProfile() running for:", user.email);
      const prof = await api.getMemberProfile(user.id);
      if (prof) {
        console.log(
          "✅ Profile loaded:",
          prof.full_name,
          prof.role,
          prof.status
        );
        setProfile(prof);
      } else {
        console.warn("⚠️ No profile found for user:", user.id);
        setProfile(null);
      }
    } catch (err: any) {
      console.error("💥 Error loading profile:", err.message);
      setProfile(null);
    }
  };

  // 🧠 Initialize session once on mount
  useEffect(() => {
    console.log("🧠 AuthContext useEffect mounted");
    let active = true;

    const getInitialSession = async () => {
      console.log("🚀 Starting getInitialSession()");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // ✅ Defer async DB calls safely
        setTimeout(() => {
          loadProfile(currentUser);
        }, 0);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    getInitialSession();

    // 🔄 Subscribe to auth state changes (with safe async deferral)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 onAuthStateChange event:", event, session?.user?.email);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // ✅ Important: use setTimeout to avoid deadlock
          setTimeout(() => loadProfile(currentUser), 0);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Cleaning up AuthContext");
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("🚪 Signing out...");
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      console.log("✅ Signed out successfully");
    } catch (err: any) {
      console.error("❌ Error signing out:", err.message);
    }
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
