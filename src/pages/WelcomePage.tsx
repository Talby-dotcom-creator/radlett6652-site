// src/pages/WelcomePage.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const logoUrl = "/radlett-logo.png";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1a33] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-xl text-white text-center"
      >
        <img src={logoUrl} alt="Radlett Lodge Logo" className="w-24 mx-auto mb-6 drop-shadow-xl" />

        <h1 className="text-3xl font-bold text-[#f5d486] mb-4">Thank You & Welcome!</h1>

        <p className="text-white/85 leading-relaxed mb-6">
          Your onboarding information has been successfully submitted.
          <br />
          <br />
          If any member has anything they would like to contribute — news, blogs, updates, or ideas
          — please get in touch with me. Likewise, if you spot any issues with the system, I would
          be grateful if you could let me know.
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
          onClick={() => navigate("/")}
          className="bg-[#f5d486] text-[#0b1a33] font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-[#eac06b] transition"
        >
          Return Home
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
