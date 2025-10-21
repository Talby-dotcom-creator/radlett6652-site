import React from "react";
import { Officer } from "../types";
import { getPublicUrl } from "../lib/optimizedApi";

interface OfficerCardProps {
  officer: Officer;
}

const OfficerCard: React.FC<OfficerCardProps> = ({ officer }) => {
  const { position, name, image, photo_path } = officer as Officer & {
    photo_path?: string;
  };

  // Determine the correct image path (supports both `image` and `photo_path`)
  let imagePath: string | null = null;

  if (photo_path) {
    // New Supabase storage format
    imagePath = photo_path.toLowerCase().startsWith("officers/")
      ? photo_path
      : `Officers/${photo_path}`;
  } else if (image) {
    // Legacy CMS field (likely already a public URL)
    imagePath = image;
  }

  // Convert to a public Supabase URL if needed
  const imageUrl = imagePath?.startsWith("http")
    ? imagePath
    : getPublicUrl(imagePath || "") || "/placeholder-officer.png";

  return (
    <div className="bg-white shadow-soft rounded-lg overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-medium">
      {imageUrl && (
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/placeholder-officer.png")}
          />
        </div>
      )}
      <div className="p-4 text-center">
        <h3 className="font-heading font-semibold text-primary-600">{name}</h3>
        <p className="text-sm text-neutral-500">{position}</p>
      </div>
    </div>
  );
};

export default OfficerCard;
