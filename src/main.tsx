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

const root = createRoot(document.getElementById("root")!);
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();

if (!recaptchaSiteKey) {
  console.error(
    "Site configuration error: VITE_RECAPTCHA_SITE_KEY is not configured."
  );
  root.render(
    <StrictMode>
      <main role="alert" className="min-h-screen grid place-items-center p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Site configuration error
          </h1>
          <p className="mt-3 text-neutral-700">
            Security verification is unavailable. Please contact the site
            administrator.
          </p>
        </div>
      </main>
    </StrictMode>
  );
} else {
  // ✅ Proper rendering with BrowserRouter
  root.render(
    <StrictMode>
      <GoogleReCaptchaProvider
        reCaptchaKey={recaptchaSiteKey}
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
}
