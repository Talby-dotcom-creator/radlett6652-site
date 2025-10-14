import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.log("🏠 Header: Auth state:", {
      user: user ? { id: user.id, email: user.email } : null,
      location: location.pathname,
    });
  }, [user, location.pathname]);

  // Scroll background + hide-on-scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-md py-4 md:py-5"
          : "bg-transparent py-6 md:py-10"
      } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* ✅ Empty spacer to balance layout (no logo or text) */}
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
          <NavLink to="/blog" active={location.pathname === "/blog"}>
            Blog
          </NavLink>
          <NavLink to="/snippets" active={location.pathname === "/snippets"}>
            Snippets
          </NavLink>
          <NavLink to="/contact" active={location.pathname === "/contact"}>
            Contact
          </NavLink>

          {!user && (
            <Link
              to="/login"
              className="flex items-center text-neutral-50 hover:text-secondary-300 transition-colors"
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

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-neutral-50 hover:text-secondary-400 transition-colors p-2"
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
          className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md shadow-md py-4 px-4 animate-fadeIn"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-4">
            <MobileNavLink to="/" active={location.pathname === "/"}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" active={location.pathname === "/about"}>
              About
            </MobileNavLink>
            <MobileNavLink to="/join" active={location.pathname === "/join"}>
              Join Us
            </MobileNavLink>
            <MobileNavLink
              to="/events"
              active={location.pathname === "/events"}
            >
              Events
            </MobileNavLink>
            <MobileNavLink to="/news" active={location.pathname === "/news"}>
              News
            </MobileNavLink>
            <MobileNavLink to="/blog" active={location.pathname === "/blog"}>
              Blog
            </MobileNavLink>
            <MobileNavLink
              to="/snippets"
              active={location.pathname === "/snippets"}
            >
              Snippets
            </MobileNavLink>
            <MobileNavLink
              to="/contact"
              active={location.pathname === "/contact"}
            >
              Contact
            </MobileNavLink>

            {!user && (
              <MobileNavLink
                to="/login"
                active={location.pathname === "/login"}
              >
                <div className="flex items-center">
                  <LogIn size={18} className="mr-2" />
                  Members Area
                </div>
              </MobileNavLink>
            )}
            {user && (
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

// Desktop NavLink
interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`font-medium transition-colors duration-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 focus:ring-offset-primary-600 ${
      active
        ? "text-secondary-400 border-b-2 border-secondary-400"
        : "text-neutral-50 hover:text-secondary-300"
    }`}
  >
    {children}
  </Link>
);

// Mobile NavLink
const MobileNavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`block py-2 px-4 font-medium rounded-md transition-colors duration-200 ${
      active
        ? "text-secondary-400 bg-primary-700/50"
        : "text-neutral-50 hover:text-secondary-300 hover:bg-primary-700/50"
    }`}
  >
    {children}
  </Link>
);

export default Header;
