// src/pages/OnboardingPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const logoUrl = "/lodge-logo.png";

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

    // Optional profile photo upload
    let photoUrl = null;
    if (photoFile) {
      const filePath = `profiles/${user.id}.jpg`;
      await supabase.storage.from("profile-photos").upload(filePath, photoFile, { upsert: true });

      const { data } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

      photoUrl = data.publicUrl;
    }

    // Update profile
    await supabase
      .from("member_profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        occupation: occupation || null,
        profile_photo_url: photoUrl,
        status: "active",
      })
      .eq("user_id", user.id);

    navigate("/members");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1a33] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8"
      >
        <img src={logoUrl} alt="Radlett Lodge Logo" className="w-24 mx-auto mb-6 drop-shadow-xl" />

        <h1 className="text-center text-3xl font-bold text-[#f5d486] mb-2">Member Onboarding</h1>
        <p className="text-center text-white/75 mb-6">
          Please complete your profile so we can verify your membership.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white/90 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white/90 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-white/90 mb-1">Occupation (optional)</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-white/90 mb-1">Profile Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="w-full p-2 rounded-xl bg-white/20 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#f5d486] text-[#0b1a33] rounded-xl font-semibold hover:bg-[#eac06b] transition shadow-md"
          >
            Complete Onboarding
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
