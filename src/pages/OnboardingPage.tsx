// src/pages/OnboardingPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const logoUrl = "/radlett-logo.png";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Upload photo if provided
    let photoUrl = null;
    if (photoFile) {
      const filePath = `profiles/${user.id}.jpg`;
      await supabase.storage.from("profile-photos").upload(filePath, photoFile, {
        upsert: true,
      });
      const { data } = supabase.storage.from("profile-photos").getPublicUrl(filePath);
      photoUrl = data.publicUrl;
    }

    // Save onboarding data
    await supabase
      .from("member_profiles")
      .update({
        full_name: fullName,
        phone: phone,
        occupation: occupation || null,
        profile_photo_url: photoUrl,
        status: "active",
      })
      .eq("user_id", user.id);

    // Redirect to welcome page
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-[#0b1a33] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-lg text-white"
      >
        <img src={logoUrl} alt="Radlett Lodge Logo" className="w-24 mx-auto mb-6 drop-shadow-xl" />

        <h1 className="text-center text-3xl font-bold mb-2 text-[#f5d486]">
          Welcome to Radlett Lodge
        </h1>
        <p className="text-center text-white/80 mb-6">
          Please complete your onboarding details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-white/90">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-white/90">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-white/90">Occupation (optional)</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-white/90">Profile Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="w-full p-2 rounded-xl bg-white/20 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#f5d486] text-[#0b1a33] font-semibold py-3 rounded-xl shadow-md hover:bg-[#eac06b] transition"
          >
            Complete Onboarding
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
