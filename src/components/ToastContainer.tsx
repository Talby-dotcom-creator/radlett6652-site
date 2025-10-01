// src/components/ToastContainer.tsx
import React from "react";
import Toast from "./Toast";

interface ToastState {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

interface ToastContainerProps {
  toasts: ToastState[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={8000}
        />
      ))}
    </div>
  );
};

export default ToastContainer;