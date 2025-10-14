// src/components/Footer.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { cmsApi } from "../lib/cmsApi";

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const siteSettings = await cmsApi.getSiteSettings();
        const settingsMap: Record<string, string> = {};
        siteSettings.forEach(
          (setting) =>
            (settingsMap[setting.setting_key] = setting.setting_value)
        );
        setSettings(settingsMap);
      } catch (error) {
        console.error("Error loading footer settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFooterSettings();
  }, []);

  const currentYear = new Date().getFullYear();
  const lodgeName = settings.lodge_name || "Radlett Lodge No. 6652";
  const contactEmail = settings.contact_email || "radlett6652@gmail.com";
  const contactPhone = settings.contact_phone || "07590 800657";
  const lodgeAddress =
    settings.lodge_address ||
    "Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire WD7 7JS";
  const facebookUrl = settings.facebook_url || "#";
  const twitterUrl = settings.twitter_url || "#";
  const instagramUrl = settings.instagram_url || "#";

  return (
    <footer className="bg-primary-900 text-neutral-100 relative pt-16 pb-8">
      {/* ✨ Gold shimmer divider */}
      <div className="relative w-40 h-[2px] mx-auto mb-8 rounded-full overflow-hidden bg-gradient-to-r from-transparent via-secondary-500 to-transparent">
        <span className="absolute inset-0 animate-footer-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
        {/* Lodge Info */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <img
              src="/icon-192.png"
              alt="Lodge Logo"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="w-16 h-16 bg-secondary-500 rounded-full items-center justify-center hidden">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <h2 className="text-lg font-heading font-bold text-secondary-400 mb-2">
            {lodgeName}
          </h2>
          <p className="text-sm text-neutral-300 mb-3 leading-relaxed">
            A Freemasons lodge under the United Grand Lodge of England —
            fostering brotherhood, charity, and self-development.
          </p>

          <div className="flex justify-center md:justify-start gap-3 mt-4">
            <a
              href={facebookUrl}
              className="hover:text-secondary-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href={twitterUrl}
              className="hover:text-secondary-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href={instagramUrl}
              className="hover:text-secondary-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-400">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-secondary-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-secondary-400 transition">
                Join Freemasonry
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="hover:text-secondary-400 transition"
              >
                Events
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-secondary-400 transition">
                News
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-secondary-400 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-400">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-secondary-400 transition">
                FAQs
              </Link>
            </li>
            <li>
              <a
                href="https://www.ugle.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-400 transition"
              >
                United Grand Lodge of England
              </a>
            </li>
            <li>
              <a
                href="https://pglherts.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-400 transition"
              >
                Provincial Grand Lodge of Hertfordshire
              </a>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-secondary-400 transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-secondary-400 transition">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 text-secondary-400">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin
                size={18}
                className="mr-2 flex-shrink-0 mt-0.5 text-secondary-400"
              />
              <span>{lodgeAddress}</span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-2 text-secondary-400" />
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-secondary-400 transition-colors"
              >
                {contactEmail}
              </a>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-2 text-secondary-400" />
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="hover:text-secondary-400 transition-colors"
              >
                {contactPhone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-700 mt-12 pt-6 text-center text-sm text-neutral-400">
        <p>
          © {currentYear} {lodgeName}. All rights reserved.
        </p>
        <p className="mt-2">
          Under the Constitution of the United Grand Lodge of England
        </p>
      </div>
    </footer>
  );
};

export default Footer;
