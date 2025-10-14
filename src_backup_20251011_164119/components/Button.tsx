import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  title?: string; // ✅ allow tooltips
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary:
    "bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500",
  outline:
    "border border-neutral-300 text-neutral-700 hover:bg-neutral-100 focus:ring-primary-500",
};

const sizeClasses = {
  sm: "px-2 py-1 text-sm rounded",
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
  // ✅ Remove fullWidth from DOM props — use it only for styling
  return (
    <button
      {...rest}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "w-full" : ""
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
