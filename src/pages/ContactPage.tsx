import React, { useState, useEffect } from "react";
import { MapPin, Mail, Phone, Clock, ExternalLink } from "lucide-react";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import ContactForm from "../components/ContactForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";

const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await optimizedApi.getSiteSettings();
        const settingsMap: Record<string, string> = {};
        data.forEach((item: any) => {
          settingsMap[item.setting_key] = item.setting_value;
        });
        setSettings(settingsMap);
      } catch (err) {
        console.error("❌ Error loading contact settings:", err);
        setError("Failed to load contact information");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const contactEmail = settings.contact_email || "mattjohnson56@hotmail.co.uk";
  const contactPhone = settings.contact_phone || "07590 800657";
  const lodgeAddress =
    settings.lodge_address ||
    "Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire WD7 7JS";
  const meetingSchedule =
    settings.meeting_schedule_description ||
    "1st Saturday December (Installation)\n2nd Saturday February\n1st Saturday April\n2nd Saturday July\n1st Saturday September\nAll at 4:00 PM unless otherwise stated";

  return (
    <>
      <HeroSection
        title="Contact Radlett Lodge"
        subtitle="Get in touch with us for inquiries about Freemasonry or joining our Lodge"
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/contact-6652.png"
        overlayOpacity={0.25}
        verticalPosition="bottom"
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 🟨 Left: Contact Info */}
            <div>
              <SectionHeading
                title="Get In Touch"
                subtitle="We welcome your inquiries about Radlett Lodge and Freemasonry."
              />

              {loading && <LoadingSpinner subtle={true} className="py-2" />}
              {error && <p className="text-red-600 mb-4">{error}</p>}

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin
                    size={20}
                    className="mr-3 text-secondary-500 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-primary-600">Address</h3>
                    <p className="text-neutral-600">
                      {lodgeAddress.split(",").map((line, i) => (
                        <React.Fragment key={i}>
                          {line.trim()}
                          {i < lodgeAddress.split(",").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <Mail
                    size={20}
                    className="mr-3 text-secondary-500 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-primary-600">Email</h3>
                    <p className="text-neutral-600">
                      <a
                        href={`mailto:${contactEmail}`}
                        className="hover:text-secondary-500 transition-colors"
                      >
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <Phone
                    size={20}
                    className="mr-3 text-secondary-500 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-primary-600">Phone</h3>
                    <p className="text-neutral-600">
                      <a
                        href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                        className="hover:text-secondary-500 transition-colors"
                      >
                        {contactPhone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Meeting Schedule */}
                <div className="flex items-start">
                  <Clock
                    size={20}
                    className="mr-3 text-secondary-500 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-primary-600">
                      Lodge Meetings
                    </h3>
                    <p className="text-neutral-600 whitespace-pre-line">
                      {meetingSchedule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visiting Info */}
              <div className="bg-neutral-50 p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="font-heading font-semibold text-primary-600 mb-3">
                  Visiting the Lodge
                </h3>
                <p className="text-neutral-600 mb-4">
                  If you're a Freemason planning to visit Radlett Lodge, please
                  contact our Secretary beforehand. Proof of membership in a
                  recognized Masonic Lodge will be required.
                </p>
                <p className="text-neutral-600">
                  The Festive Board (dinner after the meeting) begins
                  approximately at 7:30 PM. Please inform us of any dietary
                  requirements.
                </p>
              </div>
            </div>

            {/* 🟦 Right: Form + Map */}
            <div>
              {/* Contact Form */}
              <div className="bg-neutral-50 p-6 rounded-lg shadow-md border border-neutral-200 mb-8">
                <h3 className="font-heading font-semibold text-xl text-primary-600 mb-4">
                  Contact Form
                </h3>
                <ContactForm />
              </div>

              {/* Static Map Section */}
              <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-72 lg:h-80 border border-neutral-200">
                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-white rounded-full p-4 mb-4 shadow">
                    <MapPin className="w-12 h-12 text-secondary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-2">
                    Masonic Hall Radlett
                  </h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    Rose Walk, Radlett
                    <br />
                    Hertfordshire WD7 7JS
                    <br />
                    <span className="text-sm text-neutral-500 mt-2 block">
                      Located in the heart of Radlett village
                    </span>
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Masonic+Hall+Radlett/@51.6776475,-0.3175806,17z/data=!3m1!4b1!4m6!3m5!1s0x4876158eb518e1d3:0x52aefcf9fc035790!8m2!3d51.6776475!4d-0.3150057"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-secondary-500 text-primary-800 rounded-md hover:bg-secondary-600 transition-colors font-medium shadow-sm"
                  >
                    <ExternalLink size={18} className="mr-2" />
                    View on Google Maps
                  </a>
                  <p className="text-xs text-neutral-500 mt-2">
                    Click to get directions and view the location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
