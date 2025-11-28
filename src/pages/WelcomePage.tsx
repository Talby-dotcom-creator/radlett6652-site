// src/pages/WelcomePage.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const logoUrl =
  "/https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images/icon-192.png ";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    // If a signed-in, active member hits this page, send them to the Members area
    if (user && profile?.status === "active") {
      navigate("/members", { replace: true });
    }
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-[#0b1a33] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 max-w-xl w-full text-white text-center"
      >
        <img src={logoUrl} alt="Radlett Lodge Logo" className="w-24 mx-auto mb-6 drop-shadow-xl" />

        <h1 className="text-3xl font-bold text-[#f5d486] mb-4">Thank You & Welcome!</h1>

        <p className="text-white/85 leading-relaxed mb-6">
          Your onboarding information has been successfully submitted.
          <br />
          <br />
          If you have anything to contribute — news, blogs, updates, ideas — please reach out
          anytime.
          <br />
          Likewise, if you find any issues with the system, I would be grateful if you let me know.
        </p>

        <div className="text-white/90 mb-6">
          <p>
            Email: <span className="text-[#f5d486] font-semibold">radlettlodge6652@gmail.com</span>
          </p>
          <p>
            Phone: <span className="text-[#f5d486] font-semibold">07507 856680</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/members")}
          className="bg-[#f5d486] text-[#0b1a33] font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-[#eac06b] transition"
        >
          Go to Members Area
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
