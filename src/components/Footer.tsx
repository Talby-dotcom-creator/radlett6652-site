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
import { SiteSetting } from "../types";

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const siteSettings = await cmsApi.getSiteSettings();
        const settingsMap: Record<string, string> = {};
        siteSettings.forEach((setting: SiteSetting) => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
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
  const contactEmail = settings.contact_email || "secretary@radlettlodge.co.uk";
  const contactPhone = settings.contact_phone || "07590 800657";
  const lodgeAddress =
    settings.lodge_address ||
    "Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire WD7 7JS";
  const facebookUrl = settings.facebook_url || "#";
  const twitterUrl = settings.twitter_url || "#";
  const instagramUrl = settings.instagram_url || "#";

  return (
    <footer className="bg-gradient-to-b from-[#0a1a2a] to-[#101d33] text-neutral-200 pt-12 pb-6 border-t border-yellow-600/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Lodge Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/lodge-logo.png"
                alt="Lodge Crest"
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="hidden md:flex flex-col">
                <h2 className="text-xl font-bold text-yellow-500">
                  {lodgeName}
                </h2>
                <p className="text-sm text-neutral-400">
                  Freemasonry in Hertfordshire
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              A Freemasons’ lodge under the United Grand Lodge of England,
              dedicated to integrity, friendship, and charity.
            </p>
            <div className="flex space-x-4">
              <a
                href={facebookUrl}
                className="text-neutral-400 hover:text-yellow-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={twitterUrl}
                className="text-neutral-400 hover:text-yellow-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={instagramUrl}
                className="text-neutral-400 hover:text-yellow-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-yellow-400">
                  Join Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-yellow-400">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-yellow-400">
                  News
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-yellow-400">
                  The Pillars
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.ugle.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  United Grand Lodge of England
                </a>
              </li>
              <li>
                <a
                  href="https://www.pglherts.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  Provincial Grand Lodge of Hertfordshire
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-yellow-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-yellow-400">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-yellow-500" />
                <span>{lodgeAddress}</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-yellow-500" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-yellow-400"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-yellow-500" />
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="hover:text-yellow-400"
                >
                  {contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yellow-600/20 pt-6 text-center text-sm text-neutral-400">
          <p>
            © {currentYear} {lodgeName}. All rights reserved.
          </p>
          <p className="mt-2">
            Under the Constitution of the United Grand Lodge of England
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
