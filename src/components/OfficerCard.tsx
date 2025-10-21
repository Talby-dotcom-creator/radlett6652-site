import React from "react";
import { Officer } from "../types";
import { User, Star } from "lucide-react";

interface OfficerCardProps {
  officer: Officer;
}

const OfficerCard: React.FC<OfficerCardProps> = ({ officer }) => {
  const imageUrl =
    officer.image_url || officer.image || "/placeholder-officer.webp";

  return (
    <div className="radlett-card group text-center overflow-hidden">
      {/* Officer Image */}
      <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={officer.name || officer.full_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-officer.webp";
          }}
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>
      </div>

      {/* Officer Details */}
      <div className="radlett-card-content">
        <h3 className="text-xl font-heading font-semibold text-primary-700 mb-1 group-hover:text-secondary-500 transition-colors">
          {officer.name || officer.full_name}
        </h3>
        <p className="text-sm text-neutral-600 mb-3">{officer.position}</p>

        {officer.is_active && (
          <div className="flex items-center justify-center gap-1 text-secondary-500 text-sm font-medium">
            <Star className="w-4 h-4" /> Active Officer
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerCard;
