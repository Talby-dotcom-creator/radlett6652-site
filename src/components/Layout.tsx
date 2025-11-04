// src/components/Layout.tsx
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout.tsx
 * Wraps every page with the site-wide Header and Footer.
 * Ensures consistent Oxford Blue background and spacing below the fixed header.
 */

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A174E] text-neutral-50">
      {/* ======================== */}
      {/* Header - Fixed at top */}
      {/* ======================== */}
      <Header />

      {/* ======================== */}
      {/* Main Page Content Area */}
      {/* ======================== */}
      <main
        className="
          flex-grow
          pt-28 md:pt-32
          bg-[#0A174E]
          text-neutral-50
          transition-all duration-300
        "
      >
        {children}
      </main>

      {/* ======================== */}
      {/* Footer - Always visible */}
      {/* ======================== */}
      <Footer />
    </div>
  );
};

export default Layout;
