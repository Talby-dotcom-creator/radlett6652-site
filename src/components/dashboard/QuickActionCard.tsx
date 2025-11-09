import React from "react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  admin?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  description,
  onClick,
  admin = false,
}) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 border 
      transition shadow-sm hover:shadow-md
      ${
        admin
          ? "bg-[#BFA76F]/20 border-[#BFA76F]/40 text-[#0B1831]"
          : "bg-[#0B1831] border-[#0B1831]/40 text-white"
      }
    `}
  >
    <div className="p-2 rounded-lg bg-black/10">{icon}</div>
    <div>
      <div className="font-semibold">{label}</div>
      <div className="text-sm opacity-80">{description}</div>
    </div>
  </button>
);

export default QuickActionCard;
