// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Icons
import {
  Calendar,
  Newspaper,
  Users,
  MessageSquare,
  BookOpen,
  Columns3,
  HelpCircle,
  FileText,
  FolderOpen,
  Image,
  Clock,
  Settings,
} from "lucide-react";

// -----------------------------------------------------
// Styled Dashboard Button Component
// -----------------------------------------------------
interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  icon,
  label,
  count,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-xl border border-[#BFA76F]/40 text-[#0B1831] hover:bg-[#BFA76F]/10 flex items-center gap-2 transition"
  >
    {icon}
    {label}
    {typeof count === "number" && (
      <span className="ml-1 text-sm text-neutral-500">({count})</span>
    )}
  </button>
);

// -----------------------------------------------------
// Main Dashboard Page
// -----------------------------------------------------
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // All dashboard count states
  const [eventCount, setEventCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [officerCount, setOfficerCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [snippetCount, setSnippetCount] = useState(0);
  const [pillarCount, setPillarCount] = useState(0);
  const [faqCount, setFaqCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [minutesCount, setMinutesCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);

  // -----------------------------------------------------
  // Load counts from Supabase (all tables)
  // -----------------------------------------------------
  useEffect(() => {
    const loadCounts = async () => {
      // Load events count
      try {
        const { count } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true });
        setEventCount(count || 0);
      } catch (error) {
        console.error("Error loading events count:", error);
        setEventCount(0);
      }

      // Load news count (all blog_posts except category='blog')
      try {
        const { count } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true });
        setNewsCount(count || 0);
      } catch (error) {
        console.error("Error loading news count:", error);
        setNewsCount(0);
      }

      // Load officers count
      try {
        const { count } = await supabase
          .from("officers")
          .select("*", { count: "exact", head: true });
        setOfficerCount(count || 0);
      } catch (error) {
        console.error("Error loading officers count:", error);
        setOfficerCount(0);
      }

      // Load testimonials count
      try {
        const { count } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true });
        setTestimonialCount(count || 0);
      } catch (error) {
        console.error("Error loading testimonials count:", error);
        setTestimonialCount(0);
      }

      // Load snippets count
      try {
        const { count } = await supabase
          .from("snippets")
          .select("*", { count: "exact", head: true });
        setSnippetCount(count || 0);
      } catch (error) {
        console.error("Error loading snippets count:", error);
        setSnippetCount(0);
      }

      // Load FAQ count
      try {
        const { count } = await supabase
          .from("faq_items")
          .select("*", { count: "exact", head: true });
        setFaqCount(count || 0);
      } catch (error) {
        console.error("Error loading FAQ count:", error);
        setFaqCount(0);
      }

      // Load pages count
      try {
        const { count } = await supabase
          .from("page_content")
          .select("*", { count: "exact", head: true });
        setPageCount(count || 0);
      } catch (error) {
        console.error("Error loading pages count:", error);
        setPageCount(0);
      }

      // Load documents count
      try {
        const { count } = await supabase
          .from("lodge_documents")
          .select("*", { count: "exact", head: true });
        setDocumentCount(count || 0);
      } catch (error) {
        console.error("Error loading documents count:", error);
        setDocumentCount(0);
      }

      // Load minutes count
      try {
        const { count } = await supabase
          .from("meeting_minutes")
          .select("*", { count: "exact", head: true });
        setMinutesCount(count || 0);
      } catch (error) {
        console.error("Error loading minutes count:", error);
        setMinutesCount(0);
      }

      // Load Pillars count separately (blog_posts with category='blog')
      try {
        const { count } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })
          .eq("category", "blog");
        setPillarCount(count || 0);
      } catch (error) {
        console.error("Error loading pillar count:", error);
        setPillarCount(0);
      }

      // Count media files
      try {
        const { data: mediaList } = await supabase.storage
          .from("cms-media")
          .list("", { limit: 5000 });
        setMediaCount((mediaList || []).length);
      } catch (error) {
        console.error("Error loading media count:", error);
        setMediaCount(0);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="p-6">
      {/* -------------------------------------------------
           CONTENT SECTION
      ------------------------------------------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">Content</h2>
        <div className="flex flex-wrap gap-3">
          <DashboardButton
            icon={<Calendar className="w-4 h-4" />}
            label="Events"
            count={eventCount}
            onClick={() => navigate("/admin/events")}
          />

          <DashboardButton
            icon={<Newspaper className="w-4 h-4" />}
            label="News"
            count={newsCount}
            onClick={() => navigate("/admin/news")}
          />

          <DashboardButton
            icon={<MessageSquare className="w-4 h-4" />}
            label="Testimonials"
            count={testimonialCount}
            onClick={() => navigate("/admin/testimonials")}
          />

          <DashboardButton
            icon={<BookOpen className="w-4 h-4" />}
            label="Snippets"
            count={snippetCount}
            onClick={() => navigate("/admin/snippets")}
          />

          <DashboardButton
            icon={<Columns3 className="w-4 h-4" />}
            label="Pillars"
            count={pillarCount}
            onClick={() => navigate("/admin/pillars")}
          />
        </div>
      </section>

      {/* -------------------------------------------------
           STRUCTURE SECTION
      ------------------------------------------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">
          Structure
        </h2>
        <div className="flex flex-wrap gap-3">
          <DashboardButton
            icon={<FileText className="w-4 h-4" />}
            label="Pages"
            count={pageCount}
            onClick={() => navigate("/admin/pages")}
          />

          <DashboardButton
            icon={<HelpCircle className="w-4 h-4" />}
            label="FAQ"
            count={faqCount}
            onClick={() => navigate("/admin/faq")}
          />

          <DashboardButton
            icon={<FolderOpen className="w-4 h-4" />}
            label="Resources"
            onClick={() => navigate("/admin/resources")}
          />
        </div>
      </section>

      {/* -------------------------------------------------
           ADMINISTRATION SECTION
      ------------------------------------------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">
          Administration
        </h2>
        <div className="flex flex-wrap gap-3">
          <DashboardButton
            icon={<Users className="w-4 h-4" />}
            label="Officers"
            count={officerCount}
            onClick={() => navigate("/admin/officers")}
          />

          <DashboardButton
            icon={<FileText className="w-4 h-4" />}
            label="Lodge Documents"
            count={documentCount}
            onClick={() => navigate("/admin/documents")}
          />

          <DashboardButton
            icon={<Clock className="w-4 h-4" />}
            label="Minutes"
            count={minutesCount}
            onClick={() => navigate("/admin/minutes")}
          />
        </div>
      </section>

      {/* -------------------------------------------------
           ASSETS SECTION
      ------------------------------------------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">Assets</h2>
        <div className="flex flex-wrap gap-3">
          <DashboardButton
            icon={<Image className="w-4 h-4" />}
            label="Media"
            count={mediaCount}
            onClick={() => navigate("/admin/media")}
          />
        </div>
      </section>

      {/* -------------------------------------------------
           SYSTEM SECTION
      ------------------------------------------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">System</h2>
        <div className="flex flex-wrap gap-3">
          <DashboardButton
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            onClick={() => navigate("/admin/settings")}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
