import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../Button";
import { Pencil, Mail, RefreshCw } from "lucide-react";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  position: string | null;
  email?: string | null;
  contact_email: string | null;
  status: string | null;
  is_active?: boolean | null;
  notes: string | null;
  created_at: string | null;
  last_login: string | null;
}

interface EditModalProps {
  profile: MemberProfile | null;
  onClose: () => void;
  onSave: (p: Partial<MemberProfile>) => Promise<void>;
}

const EditMemberModal: React.FC<EditModalProps> = ({ profile, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<MemberProfile>>(profile || {});

  if (!profile) return null;

  const update = (key: keyof MemberProfile, value: any) => setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h3 className="text-xl font-semibold text-primary-600 mb-4">Edit Member</h3>

        <div className="space-y-4 text-neutral-900">
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              value={form.full_name || ""}
              onChange={(e) => update("full_name", e.target.value)}
              className="w-full border px-3 py-2 rounded text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Role</label>
            <select
              value={form.role || "member"}
              onChange={(e) => update("role", e.target.value)}
              className="w-full border px-3 py-2 rounded text-black bg-white"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Position (optional)</label>
            <input
              type="text"
              value={form.position || ""}
              onChange={(e) => update("position", e.target.value)}
              className="w-full border px-3 py-2 rounded text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Notes (private admin-only)</label>
            <textarea
              value={form.notes || ""}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full border px-3 py-2 rounded text-black bg-white"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onSave(form);
                onClose();
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembersManager: React.FC = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [editing, setEditing] = useState<MemberProfile | null>(null);

  const callAdminFn = async (action: string, payload: Record<string, unknown> = {}) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No active session");
    }

    const res = await fetch("/.netlify/functions/admin-members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || `Request failed (${res.status})`);
    }

    return res.json();
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("member_profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (!error && data) setMembers(data as MemberProfile[]);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resendInvite = async (email: string) => {
    const redirectTo = `${window.location.origin}/login?mode=signin&from=invite`;
    try {
      await callAdminFn("invite", { email, redirectTo });
      alert("Invite sent!");
    } catch (err: any) {
      alert("Failed to resend invite: " + (err?.message || "Unknown error"));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await callAdminFn("resetPassword", {
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      alert("Password reset email sent");
    } catch (err: any) {
      alert("Reset failed: " + (err?.message || "Unknown error"));
    }
  };

  const saveMember = async (updates: Partial<MemberProfile>) => {
    if (!editing) return;

    try {
      await callAdminFn("updateMember", {
        id: editing.id,
        ...updates,
      });
      await loadMembers();
    } catch (err: any) {
      alert("Failed to update member: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-primary-600 mb-6">
        Members ({members.length})
      </h2>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {members.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
            <div className="text-lg font-semibold">{m.full_name}</div>
            <div className="text-sm text-neutral-600">{m.role}</div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" onClick={() => setEditing(m)}>
                <Pencil size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetPassword(m.contact_email || m.email || "")}
              >
                <RefreshCw size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resendInvite(m.contact_email || m.email || "")}
              >
                <Mail size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-xl font-semibold text-primary-600">{m.full_name}</div>
              <div className="text-sm text-neutral-600 mt-1">Role: {m.role}</div>
              {m.position && <div className="text-sm text-neutral-600">Position: {m.position}</div>}
              <div className="text-sm text-neutral-500 mt-2">{m.email || m.contact_email}</div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" onClick={() => setEditing(m)}>
                <Pencil size={16} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetPassword(m.contact_email || m.email || "")}
              >
                <RefreshCw size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resendInvite(m.contact_email || m.email || "")}
              >
                <Mail size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditMemberModal profile={editing} onClose={() => setEditing(null)} onSave={saveMember} />
    </div>
  );
};

export default MembersManager;
