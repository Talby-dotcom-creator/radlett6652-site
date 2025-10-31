import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";

interface MemberProfile {
  id?: number;
  user_id: string;
  full_name: string;
  status: string | null;
  role?: string | null;
}

const AdminApprovalPage: React.FC = () => {
  const { profile } = useAuth();
  const [pendingMembers, setPendingMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPendingMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("member_profiles")
        .select("user_id, full_name, status, role")
        .eq("status", "pending")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setPendingMembers(data || []);
    } catch (err) {
      console.error("Error loading pending members:", err);
      setError("Failed to load pending members");
    } finally {
      setLoading(false);
    }
  };

  const approveMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("member_profiles")
        .update({ status: "active" })
        .eq("user_id", userId);

      if (error) throw error;

      // Remove from list immediately
      setPendingMembers((prev) =>
        prev.filter((member) => member.user_id !== userId)
      );

      alert("✅ Member approved successfully");
    } catch (err) {
      console.error("Error approving member:", err);
      alert("❌ Failed to approve member");
    }
  };

  useEffect(() => {
    loadPendingMembers();
  }, []);

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-heading font-bold text-primary-600 mb-2">
          Access Denied
        </h1>
        <p className="text-neutral-600">
          You must be an administrator to view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
        <p className="mt-3 text-neutral-600">Loading pending members...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-heading font-bold text-primary-600 mb-6">
          Pending Member Approvals
        </h1>

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        {pendingMembers.length === 0 ? (
          <p className="text-neutral-600 text-center">
            🎉 No pending members at the moment.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {pendingMembers.map((member) => (
              <li
                key={member.user_id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium text-primary-700">
                    {member.full_name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Status: {member.status}
                  </p>
                </div>
                <button
                  onClick={() => approveMember(member.user_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;
