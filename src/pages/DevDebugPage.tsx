import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const DevDebugPage: React.FC = () => {
  // Render nothing in production
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof import.meta === "undefined" || !import.meta.env?.DEV) return null;

  const { user, profile, refreshProfile, forceRefresh } = useAuth();
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState<string | null>(null);

  const promoteToActive = async () => {
    if (!profile) return setPromoteResult("No profile to promote");
    setPromoteLoading(true);
    try {
      // Call API helper if available to promote (this is dev-only; api exposes updateMemberProfile)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { api } = await import("../lib/api");
      // api.updateMemberProfile expects (profileIdOrUserId, attrs)
      const target = (profile as any).id || (profile as any).user_id;
      if (!target) throw new Error("Could not determine profile id/user_id");
      await api.updateMemberProfile(target, { status: "active" });
      setPromoteResult("Promoted to active (dev)");
      await forceRefresh();
    } catch (err: any) {
      setPromoteResult(`Error: ${err?.message || String(err)}`);
    } finally {
      setPromoteLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!profile) return setPromoteResult("No profile to promote");
    setPromoteLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { api } = await import("../lib/api");
      const target =
        (profile as any).id || (profile as any).user_id || user?.id;
      if (!target) throw new Error("Could not determine profile id/user_id");
      await api.updateMemberProfile(target, {
        status: "active",
        role: "admin",
      });
      setPromoteResult("Promoted to admin (dev)");
      await forceRefresh();
    } catch (err: any) {
      setPromoteResult(`Error: ${err?.message || String(err)}`);
    } finally {
      setPromoteLoading(false);
    }
  };

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dev debug — auth & profile</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Session / User</h2>
        <pre className="bg-neutral-100 p-3 rounded mt-2 overflow-auto text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Member profile</h2>
        <pre className="bg-neutral-100 p-3 rounded mt-2 overflow-auto text-sm">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </section>

      <div className="flex gap-3">
        <Button onClick={refreshProfile}>Refresh profile</Button>
        <Button onClick={forceRefresh}>Force refresh</Button>
        <Button
          onClick={promoteToActive}
          disabled={promoteLoading}
          variant="secondary"
        >
          Promote to active (dev)
        </Button>
        <Button
          onClick={promoteToAdmin}
          disabled={promoteLoading}
          variant="primary"
        >
          Promote to admin (dev)
        </Button>
        <Button
          onClick={async () => {
            if (!user) return;
            try {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const { api } = await import("../lib/api");
              const name =
                (user.user_metadata &&
                  (user.user_metadata.name || user.user_metadata.full_name)) ||
                (user.email ? user.email.split("@")[0] : "Dev User");
              await api.createMemberProfile(user.id, name);
              // make it pending to match app semantics
              await api.updateMemberProfile(user.id, { status: "pending" });
              await forceRefresh();
            } catch (err: any) {
              // eslint-disable-next-line no-console
              console.error("DevDebug: create profile error", err);
            }
          }}
        >
          Create pending profile for user
        </Button>
      </div>

      {promoteResult && <div className="mt-4 text-sm">{promoteResult}</div>}
    </div>
  );
};

export default DevDebugPage;
