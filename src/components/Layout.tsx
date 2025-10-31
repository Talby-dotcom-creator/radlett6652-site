// src/components/Layout.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* ✅ Header / Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Left – Logo / Title */}
          <Link
            to="/"
            className="text-xl font-heading font-semibold text-primary-700 hover:text-primary-900 transition"
          >
            Radlett Lodge No. 6652
          </Link>

          {/* Center – Main Navigation */}
          <nav className="space-x-6 hidden md:flex">
            <Link
              to="/about"
              className={`hover:text-primary-700 ${
                location.pathname === "/about"
                  ? "text-primary-700 font-medium"
                  : "text-neutral-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/events"
              className={`hover:text-primary-700 ${
                location.pathname === "/events"
                  ? "text-primary-700 font-medium"
                  : "text-neutral-600"
              }`}
            >
              Events
            </Link>
            <Link
              to="/news"
              className={`hover:text-primary-700 ${
                location.pathname === "/news"
                  ? "text-primary-700 font-medium"
                  : "text-neutral-600"
              }`}
            >
              News
            </Link>
            <Link
              to="/contact"
              className={`hover:text-primary-700 ${
                location.pathname === "/contact"
                  ? "text-primary-700 font-medium"
                  : "text-neutral-600"
              }`}
            >
              Contact
            </Link>

            {/* ✅ Members Area (always visible for navigation) */}
            <Link
              to="/members"
              className={`hover:text-primary-700 ${
                location.pathname.startsWith("/members")
                  ? "text-primary-700 font-medium"
                  : "text-neutral-600"
              }`}
            >
              Members
            </Link>
          </nav>

          {/* Right – User status or Logout */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-neutral-700">
                  👋 {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm text-primary-700 hover:text-primary-900 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Main Page Content */}
      <main className="flex-grow">{children}</main>

      {/* ✅ Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-6 text-center text-sm mt-10">
        <p>
          © {new Date().getFullYear()} Radlett Lodge No. 6652 – Province of
          Hertfordshire
        </p>
      </footer>
    </div>
  );
};

export default Layout;
