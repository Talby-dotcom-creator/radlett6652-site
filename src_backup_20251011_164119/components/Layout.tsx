// ...existing code...
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900">
      <Header /> {/* ✅ Top navigation and logo */}
      <main className="flex-grow overflow-hidden">{children}</main>
      <Footer /> {/* ✅ Footer */}
    </div>
  );
};

export default Layout;
