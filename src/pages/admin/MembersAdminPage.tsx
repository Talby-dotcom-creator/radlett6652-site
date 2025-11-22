import React from "react";
import { useNavigate } from "react-router-dom";
import MembersAdminSection from "../../components/admin/MembersAdminSection";
import Button from "../../components/Button";

const MembersAdminPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
            <Button variant="outline" onClick={() => navigate("/members")}>
              Back to Members
            </Button>
          </div>
          <h1 className="text-2xl font-semibold text-primary-700">
            Members Administration
          </h1>
        </div>
        <MembersAdminSection />
      </div>
    </div>
  );
};

export default MembersAdminPage;
