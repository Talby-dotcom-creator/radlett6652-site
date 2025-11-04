// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // ✅ Always Oxford Blue — no scroll or transparency logic
  const headerClass =
    "fixed top-0 left-0 right-0 z-50 bg-[#0A174E] text-neutral-50 shadow-md py-4 md:py-5 transition-all duration-300 ease-in-out";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="w-6 md:w-10" />

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8"
          role="navigation"
          aria-label="Main navigation"
        >
          <NavLink to="/" active={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink to="/about" active={location.pathname === "/about"}>
            About
          </NavLink>
          <NavLink to="/join" active={location.pathname === "/join"}>
            Join Us
          </NavLink>
          <NavLink to="/events" active={location.pathname === "/events"}>
            Events
          </NavLink>
          <NavLink to="/news" active={location.pathname === "/news"}>
            News
          </NavLink>
          <NavLink to="/snippets" active={location.pathname === "/snippets"}>
            Snippets
          </NavLink>
          <NavLink to="/blog" active={location.pathname === "/blog"}>
            The Pillars
          </NavLink>
          <NavLink to="/contact" active={location.pathname === "/contact"}>
            Contact
          </NavLink>

          {/* ✅ Members Area (no logout button) */}
          {!user && (
            <Link
              to="/login"
              className="flex items-center text-neutral-50 hover:text-[#FFD700] transition-colors"
              aria-label="Members Area Login"
            >
              <LogIn size={18} className="mr-2" />
              Members Area
            </Link>
          )}
          {user && (
            <NavLink
              to="/members"
              active={location.pathname.startsWith("/members")}
            >
              Members Area
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-neutral-50 hover:text-[#FFD700] transition-colors p-2"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-[#0A174E] shadow-md py-4 px-4 animate-fadeIn"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-4">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/join", label: "Join Us" },
              { to: "/events", label: "Events" },
              { to: "/news", label: "News" },
              { to: "/snippets", label: "Snippets" },
              { to: "/blog", label: "The Pillars" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <MobileNavLink
                key={item.to}
                to={item.to}
                active={location.pathname === item.to}
              >
                {item.label}
              </MobileNavLink>
            ))}

            {/* ✅ Members Link for Mobile */}
            {!user ? (
              <MobileNavLink
                to="/login"
                active={location.pathname === "/login"}
              >
                <div className="flex items-center">
                  <LogIn size={18} className="mr-2" /> Members Area
                </div>
              </MobileNavLink>
            ) : (
              <MobileNavLink
                to="/members"
                active={location.pathname.startsWith("/members")}
              >
                Members Area
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// 🔗 Reusable Link Components
interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`font-medium transition-colors duration-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0A174E] ${
      active
        ? "text-[#FFD700] border-b-2 border-[#FFD700]"
        : "text-neutral-50 hover:text-[#FFD700]"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`block py-2 px-4 font-medium rounded-md transition-colors duration-200 ${
      active
        ? "text-[#FFD700] bg-[#112168]/70"
        : "text-neutral-50 hover:text-[#FFD700] hover:bg-[#112168]/50"
    }`}
  >
    {children}
  </Link>
);

export default Header;
