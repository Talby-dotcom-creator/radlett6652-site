import React from "react";
import { Officer } from "../types";
import { User, Star } from "lucide-react";

interface OfficerCardProps {
  officer: Officer;
}

const OfficerCard: React.FC<OfficerCardProps> = ({ officer }) => {
  const imageUrl =
    officer.image_url || officer.image || "/placeholder-officer.webp";

  // Split name into first name and surname
  const fullName = officer.name || officer.full_name || "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const surname = nameParts.slice(1).join(" ") || "";

  return (
    <div className="radlett-card group text-center overflow-hidden h-full flex flex-col">
      {/* Officer Image */}
      <div className="relative w-full h-56 overflow-hidden rounded-t-2xl flex-shrink-0">
        <img
          src={imageUrl}
          alt={fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-officer.webp";
          }}
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>
      </div>

      {/* Officer Details */}
      <div className="radlett-card-content flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-heading font-semibold text-amber-400 mb-1 group-hover:text-amber-300 transition-colors">
            <div>{firstName}</div>
            {surname && <div>{surname}</div>}
          </h3>
          <p className="text-sm text-amber-100/70 mb-3">{officer.position}</p>
        </div>

        {officer.is_active && (
          <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-medium">
            <Star className="w-4 h-4 fill-amber-400" /> Active Officer
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerCard;
