// src/components/ContactForm.tsx
import React, { useState } from "react";
import Button from "./Button";

const ContactForm: React.FC = () => {
  // Toggle this to true while testing, false in production
  const debugMode = true;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    interested: false,
    honey: "", // honeypot field
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [debugResponse, setDebugResponse] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // honeypot spam trap
    if (formData.honey) {
      console.warn("Spam bot detected");
      return;
    }

    setFormStatus("submitting");
    setErrorMessage("");
    setDebugResponse(null);

    try {
      const response = await fetch(
        "https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error (${response.status}): ${errorText || "Unknown"}`
        );
      }

      const result = await response.json();
      if (debugMode) setDebugResponse(result);

      setFormStatus("success");

      // Reset form after 5s
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          interested: false,
          honey: "",
        });
        setFormStatus("idle");
        setDebugResponse(null);
      }, 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      setFormStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden from users) */}
      <input
        type="text"
        name="honey"
        value={formData.honey}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        data-testid="honeypot"
      />

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-primary-600"
        >
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={formStatus === "submitting"}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-primary-600"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={formStatus === "submitting"}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block mb-2 text-sm font-medium text-primary-600"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={formStatus === "submitting"}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block mb-2 text-sm font-medium text-primary-600"
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={formStatus === "submitting"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 
             text-black bg-white focus:ring-2 focus:ring-[#FFD700] 
             focus:border-[#FFD700] transition-all"
        >
          <option value="">Select a subject</option>
          <option value="membership">Membership Enquiry</option>
          <option value="events">Events</option>
          <option value="charity">Charity</option>
          <option value="general">General Enquiry</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-primary-600"
        >
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          disabled={formStatus === "submitting"}
          // Request that Grammarly (and similar editors) do not activate on this field
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 
             text-black bg-white placeholder-gray-400 
             focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] 
             transition-all"
          placeholder="Your message"
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="interested"
          name="interested"
          checked={formData.interested}
          onChange={handleCheckboxChange}
          disabled={formStatus === "submitting"}
          className="mt-1 mr-2 disabled:cursor-not-allowed"
        />
        <label htmlFor="interested" className="text-sm text-primary-600">
          I am interested in becoming a Freemason and would like more
          information
        </label>
      </div>

      {/* Submit + status */}
      <div className="flex items-center space-x-4">
        <Button
          type="submit"
          disabled={formStatus === "submitting"}
          className="min-w-[150px]"
        >
          {formStatus === "submitting" ? "Sending..." : "Send Message"}
        </Button>

        {formStatus === "success" && (
          <div className="text-green-600 font-medium animate-fadeIn">
            ✓ Your message has been sent successfully!
          </div>
        )}

        {formStatus === "error" && (
          <div className="text-red-600 font-medium animate-fadeIn">
            ✗ {errorMessage}
          </div>
        )}
      </div>

      {/* Debug block (only if debugMode = true) */}
      {debugMode && debugResponse && (
        <pre className="bg-neutral-100 p-3 rounded-md text-xs overflow-auto max-h-48">
          {JSON.stringify(debugResponse, null, 2)}
        </pre>
      )}
    </form>
  );
};

export default ContactForm;
