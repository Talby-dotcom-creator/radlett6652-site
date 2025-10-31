import React from "react";

const LoadingSpinner: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"
  />
);

export default LoadingSpinner;
