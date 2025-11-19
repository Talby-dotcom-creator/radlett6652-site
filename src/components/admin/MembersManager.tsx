import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../Button";
import { Pencil, Trash2, Mail, RefreshCw } from "lucide-react";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  position: string | null;
  email: string | null;
  contact_email: string | null;
  status: string | null;
  is_active: boolean | null;
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={form.full_name || ""}
              onChange={(e) => update("full_name", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={form.role || "member"}
              onChange={(e) => update("role", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Position (optional)</label>
            <input
              type="text"
              value={form.position || ""}
              onChange={(e) => update("position", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notes (private admin-only)</label>
            <textarea
              value={form.notes || ""}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full border px-3 py-2 rounded"
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
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MemberProfile | null>(null);

  const loadMembers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("member_profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (!error && data) setMembers(data as MemberProfile[]);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resendInvite = async (email: string) => {
    const { error } = await supabase.auth.admin.inviteUserByEmail(email);
    if (error) alert("Failed to resend invite");
    else alert("Invite sent!");
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert("Reset failed");
    else alert("Password reset email sent");
  };

  const saveMember = async (updates: Partial<MemberProfile>) => {
    if (!editing) return;

    const { error } = await supabase.from("member_profiles").update(updates).eq("id", editing.id);

    if (error) alert("Failed to update member");
    else await loadMembers();
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
