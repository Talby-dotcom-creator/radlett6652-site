import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "xs" | "sm" | "md" | "lg"; // ✅ added xs
  title?: string;
  fullWidth?: boolean;
}

// ✅ Updated styles tuned for both light + dark themes
const variantClasses = {
  primary:
    "bg-[#BFA76F] text-[#0B1831] hover:bg-[#D8C48C] focus:ring-[#BFA76F] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-[#1a1f35] text-[#BFA76F] border border-[#BFA76F]/40 hover:bg-[#BFA76F]/10 focus:ring-[#BFA76F]/40 transition",
  outline:
    "border border-[#BFA76F]/40 text-[#BFA76F] hover:bg-[#BFA76F]/20 focus:ring-[#BFA76F]/40 transition disabled:opacity-40",
};

// ✅ Added “xs” option and normalized paddings
const sizeClasses = {
  xs: "px-2 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-lg",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  fullWidth = false,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`
        inline-flex items-center justify-center font-medium transition
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
