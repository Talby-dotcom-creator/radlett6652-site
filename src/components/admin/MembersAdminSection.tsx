import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { uploadMedia } from "../../lib/supabaseUpload";
import type { Database } from "../../types/supabase";
import { Pencil, Mail, RefreshCcw, UserMinus, UserPlus, Shield } from "lucide-react";
import Button from "../Button";
import LoadingSpinner from "../LoadingSpinner";
import { setupAdminProfile } from "../../utils/setupAdmin";

type MemberProfile = Database["public"]["Tables"]["member_profiles"]["Row"] & {
  // Derived from auth users list; not stored on member_profiles
  email: string | null;
  // Optional photo url (not present in generated type in some envs)
  profile_photo_url?: string | null;
};

const MembersAdminSection: React.FC = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<MemberProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);

  // Call Netlify function that uses the service role key for admin-only actions
  const callAdminFn = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
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
      const msg = body?.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return res.json();
  }, []);

  // ---------------------------------------------------------
  // Load members + profile info
  // ---------------------------------------------------------
  const loadMembers = useCallback(async () => {
    setLoading(true);

    try {
      const { data: profiles, error } = await supabase
        .from("member_profiles")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        throw error;
      }

      // Try to enrich with auth user emails via service-role function, but don't fail the list if that call fails
      let authUsers: any[] = [];
      try {
        const adminResp = await callAdminFn("listUsers");
        authUsers = Array.isArray(adminResp.users) ? adminResp.users : [];
      } catch (e) {
        console.warn("Admin listUsers failed, falling back to profile emails only:", e);
      }

      const merged: MemberProfile[] = (profiles ?? []).map((p) => {
        const match = authUsers.find((u: any) => u.id === p.user_id);
        return {
          ...(p as MemberProfile),
          email: match?.email ?? p.contact_email ?? null,
        };
      });

      setMembers(merged);
    } catch (err) {
      console.error("Failed loading members:", err);
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [callAdminFn]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);
  useEffect(() => {
    setPhotoUrl(editingMember?.profile_photo_url ?? null);
  }, [editingMember]);

  // ---------------------------------------------------------
  // Resend Invite
  // ---------------------------------------------------------
  const handleResendInvite = async (email: string) => {
    try {
      await callAdminFn("invite", {
        email,
        redirectTo: `${window.location.origin}/login?mode=signin&from=invite`,
      });
      alert("Invite resent");
    } catch (err: any) {
      alert("Failed to resend invite: " + err.message);
    }
  };

  // ---------------------------------------------------------
  // Reset Password
  // ---------------------------------------------------------
  const handleResetPassword = async (email: string) => {
    try {
      await callAdminFn("resetPassword", {
        email,
        redirectTo: window.location.origin + "/reset-password",
      });
      alert("Password reset email sent");
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  // ---------------------------------------------------------
  // Activate / Deactivate
  // ---------------------------------------------------------
  const toggleActive = async (m: MemberProfile) => {
    const nextStatus = m.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("member_profiles")
      .update({ status: nextStatus })
      .eq("id", m.id);

    if (error) {
      alert("Failed updating active state");
    } else {
      loadMembers();
    }
  };

  // ---------------------------------------------------------
  // Save Member Profile Changes
  // ---------------------------------------------------------
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadMedia(file, "member-photos");
      setPhotoUrl(uploadedUrl);
    } catch (err: any) {
      alert("Failed to upload photo: " + (err?.message || "Unknown error"));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    const form = event.currentTarget;
    const full_name = (form.elements.namedItem("full_name") as HTMLInputElement).value;
    const position = (form.elements.namedItem("position") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value;
    const profile_photo_url = photoUrl;

    setSaving(true);

    const { error } = await supabase
      .from("member_profiles")
      .update({
        full_name,
        position,
        role,
        contact_phone: phone,
        status,
        profile_photo_url: profile_photo_url || null,
      })
      .eq("id", editingMember.id);

    setSaving(false);

    if (error) {
      alert("Failed to save changes");
    } else {
      setEditingMember(null);
      loadMembers();
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  if (loading) {
    return (
      <div className="py-12 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-primary-600 mb-6">
        Members ({members.length})
      </h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              setActionBusy(true);
              await setupAdminProfile();
              alert("Admin profile refreshed");
              loadMembers();
            } catch (err: any) {
              alert(err?.message || "Failed to refresh admin profile");
            } finally {
              setActionBusy(false);
            }
          }}
          disabled={actionBusy}
        >
          <Shield size={14} className="mr-2" />
          {actionBusy ? "Updating…" : "Refresh my admin profile"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => loadMembers()} disabled={loading}>
          Reload list
        </Button>
      </div>

      {/* Invite Form */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-primary-600 mb-3">Invite a member</h3>
        <form
          className="flex flex-col md:flex-row gap-3 items-start md:items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!inviteEmail) {
              alert("Email is required");
              return;
            }
            setInviting(true);
            try {
              await callAdminFn("invite", {
                email: inviteEmail,
                full_name: inviteName,
              });
              alert("Invite sent and profile created as active member");
              setInviteEmail("");
              setInviteName("");
              loadMembers();
            } catch (err: any) {
              alert(err?.message || "Failed to send invite");
            } finally {
              setInviting(false);
            }
          }}
        >
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2"
              placeholder="member@example.com"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2"
              placeholder="Full name (optional)"
            />
          </div>
          <div>
            <Button type="submit" disabled={inviting}>
              {inviting ? "Sending…" : "Send invite"}
            </Button>
          </div>
        </form>
      </div>

      {/* -----------------------------------------------------
           CARDS (Desktop)
      ----------------------------------------------------- */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-primary-700">{m.full_name}</h3>
              {m.profile_photo_url ? (
                <img
                  src={m.profile_photo_url}
                  alt={`${m.full_name} profile`}
                  className="w-12 h-12 rounded-full object-cover mt-2 border"
                />
              ) : null}
              <p className="text-sm text-neutral-600">{m.position || "No office assigned"}</p>
              <p className="text-sm text-neutral-500 mt-1">Role: {m.role}</p>
              <p className="text-sm text-neutral-500">Email: {m.email}</p>
              <p className="text-sm text-neutral-500">Phone: {m.contact_phone || "—"}</p>
              <p className="text-xs text-neutral-400 mt-1">Status: {m.status || "active"}</p>
              <p className="text-xs text-neutral-400">Active: {m.status === "active" ? "Yes" : "No"}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => setEditingMember(m)}>
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button size="sm" onClick={() => handleResendInvite(m.email!)}>
                <Mail size={14} className="mr-1" /> Resend Invite
              </Button>
              <Button size="sm" onClick={() => handleResetPassword(m.email!)}>
                <RefreshCcw size={14} className="mr-1" /> Reset Password
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={m.status === "active" ? "text-red-600" : "text-green-600"}
                onClick={() => toggleActive(m)}
              >
                {m.status === "active" ? (
                  <>
                    <UserMinus size={14} className="mr-1" /> Deactivate
                  </>
                ) : (
                  <>
                    <UserPlus size={14} className="mr-1" /> Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* -----------------------------------------------------
           LIST (Mobile)
      ----------------------------------------------------- */}
      <div className="md:hidden space-y-3">
        {members.map((m) => (
          <div key={m.id} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{m.full_name}</p>
                <p className="text-xs text-neutral-500">{m.position || "—"}</p>
                <p className="text-xs text-neutral-500">{m.email}</p>
              </div>

              <button onClick={() => setEditingMember(m)}>
                <Pencil size={18} className="text-primary-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* -----------------------------------------------------
           EDIT MODAL
      ----------------------------------------------------- */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Member: {editingMember.full_name}</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={editingMember.full_name}
                  className="w-full border rounded-md px-3 py-2 mt-1 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Position / Office</label>
                <input
                  type="text"
                  name="position"
                  defaultValue={editingMember.position || ""}
                  className="w-full border rounded-md px-3 py-2 mt-1 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  name="role"
                  defaultValue={editingMember.role}
                  className="w-full border rounded-md px-3 py-2 mt-1 text-neutral-900 focus:border-secondary-500 focus:ring-secondary-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={editingMember.contact_phone || ""}
                  className="w-full border rounded-md px-3 py-2 mt-1 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingPhoto ? "Uploading..." : "Browse & Upload"}
                </Button>
                <input
                  type="url"
                  name="profile_photo_url"
                  value={photoUrl ?? ""}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border rounded-md px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:border-secondary-500 focus:ring-secondary-500"
                />
                {photoUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={photoUrl}
                      alt={`${editingMember.full_name} profile`}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                    <span className="text-xs text-neutral-500 break-all">{photoUrl}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  defaultValue={editingMember.status || "active"}
                  className="w-full border rounded-md px-3 py-2 mt-1 text-neutral-900 focus:border-secondary-500 focus:ring-secondary-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="retired">Retired</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersAdminSection;
