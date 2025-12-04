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
  ClipboardList,
  CheckSquare,
  X,
  Plus,
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
  type TodoItem = { id: string; text: string; done: boolean };

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
  const [showTodo, setShowTodo] = useState(false);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Simple local to-do storage for admins
  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin.todo");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTodoItems(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("admin.todo", JSON.stringify(todoItems));
    } catch {
      /* ignore */
    }
  }, [todoItems]);

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    const id =
      (typeof crypto !== "undefined" && (crypto as any).randomUUID?.()) ||
      `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setTodoItems((prev) => [
      { id, text, done: false },
      ...prev,
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  };

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
      {/* Top bar with quick To-Do access */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-primary-800">Admin Dashboard</h1>
          <p className="text-sm text-neutral-600">
            Quick links and an admin-only to-do list to track website tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTodo(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#BFA76F]/60 bg-white px-4 py-2 text-sm font-semibold text-[#0B1831] shadow-sm hover:bg-[#BFA76F]/10 focus:outline-none focus:ring-2 focus:ring-[#BFA76F]"
        >
          <ClipboardList className="w-4 h-4" />
          Admin To-Do
        </button>
      </section>

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
            icon={<Users className="w-4 h-4" />}
            label="Members"
            onClick={() => navigate("/admin/members")}
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

      {showTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#BFA76F]/40">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#BFA76F]" />
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1831]">Admin To-Do</h3>
                  <p className="text-xs text-neutral-600">Private to this browser (local)</p>
                </div>
              </div>
              <button
                onClick={() => setShowTodo(false)}
                className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#BFA76F]"
                aria-label="Close to-do"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="flex gap-2">
                <input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTodo();
                  }}
                  placeholder="Add a task for the website..."
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA76F]"
                />
                <button
                  type="button"
                  onClick={addTodo}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#BFA76F] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-[#a18f5b]"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {todoItems.length === 0 && (
                  <p className="text-sm text-neutral-600">
                    Nothing yet. Add tasks you want to track here.
                  </p>
                )}
                {todoItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 bg-neutral-50"
                  >
                    <button
                      onClick={() => toggleTodo(item.id)}
                      className={`p-1 rounded-md border ${
                        item.done
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "border-neutral-300 text-neutral-600"
                      } hover:bg-neutral-100`}
                      aria-label={item.done ? "Mark as not done" : "Mark as done"}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-sm">
                      <span className={item.done ? "line-through text-neutral-500" : ""}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      onClick={() => removeTodo(item.id)}
                      className="p-1 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete task"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
