import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode =
    params.get("mode") === "signup" || params.get("invite") === "1"
      ? "signup"
      : "signin";
  const isInviteFlow =
    params.get("invite") === "1" || params.get("from") === "invite";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { error, success } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const updatedParams = new URLSearchParams(location.search);
    if (
      updatedParams.get("mode") === "signup" ||
      updatedParams.get("invite") === "1"
    ) {
      setMode("signup");
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      if (mode === "signin") {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (authError) {
          setFormError(authError.message);
          error(authError.message);
          throw authError;
        }

        if (data.user) {
          let profileRole: "admin" | "member" | null = null;

          if (isInviteFlow) {
            try {
              const existingProfile = await api.getMemberProfile(data.user.id);
              profileRole =
                existingProfile?.role === "admin" ? "admin" : "member";

              const resolvedName =
                fullName ||
                (data.user.user_metadata?.full_name as string | undefined) ||
                data.user.email ||
                "";

              await api
                .updateMemberProfile(data.user.id, {
                  status: "active",
                  full_name: resolvedName,
                  role: profileRole || "member",
                })
                .catch(async () => {
                  await api.createMemberProfile(data.user.id, resolvedName);
                });
            } catch (profileErr) {
              console.warn("Invite flow: could not auto-activate profile", profileErr);
            }
          } else {
            try {
              const existingProfile = await api.getMemberProfile(data.user.id);
              profileRole =
                existingProfile?.role === "admin" ? "admin" : "member";
            } catch {
              profileRole = null;
            }
          }

          success("Welcome back! Successfully signed in.");

          setTimeout(() => {
            if (onSuccess) onSuccess();
            const isAdmin = profileRole === "admin";
            if (isAdmin) {
              window.location.href = "/admin";
              return;
            }

            window.location.href = "/members";
          }, 300);
        } else {
          throw new Error("No user returned from sign in");
        }
      } else {
        // SIGNUP
        if (!fullName.trim()) {
          throw new Error("Full name is required");
        }
        if (!email.trim()) {
          throw new Error("Email is required");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { data, error: authError } = await supabase.auth.signUp(
          {
            email: email.trim(),
            password,
          },
          {
            emailRedirectTo: `${window.location.origin}/login?mode=signin&from=signup-email`,
          }
        );

        if (authError) {
          setFormError(authError.message);
          error(authError.message);
          throw authError;
        }

        if (data.user) {
          try {
            await api.updateMemberProfile(data.user.id, {
              full_name: fullName,
              status: "active",
              role: "member",
            });
          } catch {
            await api.createMemberProfile(data.user.id, fullName);
          }
          success("Account created and activated. Welcome!");
          navigate("/members");
        } else {
          success(
            "Account creation initiated. Please check your email if confirmation is required."
          );
        }
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setFormError(errorMessage);
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">Error: {formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "signup" && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-primary-600"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={mode === "signup"}
              placeholder="Enter your full name"
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary-600"
          >
            Email address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary-600"
          >
            Password{" "}
            {mode === "signup" && (
              <span className="text-sm text-neutral-500">
                (min 6 characters)
              </span>
            )}
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={
                mode === "signup"
                  ? "Create a password (min 6 characters)"
                  : "Enter your password"
              }
              className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="px-3 py-2 rounded-md border border-neutral-300 text-sm text-primary-700 hover:bg-neutral-50"
            >
              {showPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>

        <div>
          <Button type="submit" disabled={loading} fullWidth>
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </div>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setPassword("");
              setFullName("");
            }}
            className="text-secondary-500 hover:text-secondary-600"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
