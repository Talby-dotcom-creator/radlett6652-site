import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App";
import "./index.css";
import "react-quill/dist/quill.snow.css";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { supabase } from "./lib/supabase";

// 🧩 Silence harmless React warnings in development
if (import.meta.env.DEV) {
  const suppressed = [
    "UNSAFE_componentWillMount",
    "React Router Future Flag Warning",
  ];

  const origWarn = console.warn;
  console.warn = (...args) => {
    if (suppressed.some((s) => args.join(" ").includes(s))) return;
    origWarn(...args);
  };

  const origError = console.error;
  console.error = (...args) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("UNSAFE_componentWillMount")
    )
      return;
    origError(...args);
  };
}

// 🧩 Expose Supabase for console debugging
(window as any).supabase = supabase;

// ✅ Proper rendering with BrowserRouter
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey="6Le51QosAAAAAEBZSKZXIMTfzuBhMaV5e6B1vpJd"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <BrowserRouter>
        <ErrorBoundary>
          <HelmetProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </StrictMode>
);
