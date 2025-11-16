import React from "react";
import { Link } from "react-router-dom";

interface QuickActionTileProps {
  to: string;
  title: string;
  subtitle?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const QuickActionTile: React.FC<QuickActionTileProps> = ({ to, title, subtitle, Icon }) => {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-xl border border-[#BFA76F] bg-[#BFA76F]/15 p-4 hover:bg-[#BFA76F]/20 transition shadow-md hover:shadow-lg text-[#0B1831]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center justify-center rounded-md bg-[#BFA76F]/25 p-2">
            <Icon className="w-5 h-5 text-[#0B1831]" />
          </span>
          <div className="min-w-0">
            <div className="font-semibold truncate">{title}</div>
            {subtitle && <div className="text-xs opacity-90 truncate">{subtitle}</div>}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-[#0B1831] opacity-90 group-hover:translate-x-0.5 transition"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
};

export default QuickActionTile;
