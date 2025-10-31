import React from "react";
import { useAuth } from "../contexts/AuthContext";

// Dev-only small banner to speed switching accounts during local development.
const DevAuthBanner: React.FC = () => {
  // Vite exposes import.meta.env.DEV; guard to ensure this never ships to prod.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
  const { user, signOut } = useAuth();

  if (!isDev) return null;

  const clearAndReload = async () => {
    try {
      // Clear common storage keys used by Supabase
      Object.keys(localStorage).forEach((k) => {
        if (/supabase|sb|sb:auth|supabase.auth/i.test(k))
          localStorage.removeItem(k);
      });
      sessionStorage.clear();
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if (
        typeof navigator !== "undefined" &&
        (navigator as any).serviceWorker
      ) {
        (navigator as any).serviceWorker
          .getRegistrations?.()
          .then((regs: any[]) => regs.forEach((r) => r.unregister()));
      }
    } catch (e) {
      // ignore
    }
    location.reload();
  };

  return (
    <div className="fixed left-4 bottom-4 z-50 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded p-3 shadow-md text-sm">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-medium">DEV AUTH</div>
          <div className="text-xs">{user?.email ?? "(no session)"}</div>
        </div>
        <div className="ml-2 flex gap-2">
          <button
            className="px-2 py-1 bg-white border rounded text-xs"
            onClick={async () => {
              try {
                await signOut();
              } catch (e) {
                // fallback: clear tokens
                Object.keys(localStorage).forEach((k) => {
                  if (/supabase|sb|sb:auth|supabase.auth/i.test(k))
                    localStorage.removeItem(k);
                });
                sessionStorage.clear();
                location.reload();
              }
            }}
          >
            Sign out
          </button>
          <button
            className="px-2 py-1 bg-white border rounded text-xs"
            onClick={clearAndReload}
          >
            Clear storage & reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevAuthBanner;
