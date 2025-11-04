// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import JoinPage from "./pages/JoinPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import NewsPostPage from "./pages/NewsPostPage";
import PillarsPage from "./pages/PillarsPage";
import PillarPostDetail from "./pages/PillarPostDetail";
import SnippetsPage from "./pages/SnippetsPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

// Auth-related pages
import LoginPage from "./pages/LoginPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";

// Members & Admin pages
import MembersPage from "./pages/MembersPage";
import CMSPage from "./pages/CMSPage";
import AdminApprovalPage from "./pages/AdminApprovalPage";

// Developer utility (only active in dev)
import DevDebugPage from "./pages/DevDebugPage";

// Route guards
import ProtectedRoute from "./ProtectedRoute";

// ---------------------------------------------------------
// Application Routes
// ---------------------------------------------------------
const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />
        {/* ---------------- THE PILLARS (BLOG) ---------------- */}
        <Route path="/blog" element={<PillarsPage />} />
        <Route path="/blog/:slug" element={<PillarPostDetail />} />

        {/* ✅ Optional: redirect old /pillars URLs to /blog for SEO safety */}
        <Route path="/pillars" element={<Navigate to="/blog" replace />} />
        <Route
          path="/pillars/:slug"
          element={<Navigate to="/blog" replace />}
        />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* ---------------- AUTH ROUTES ---------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pending" element={<PendingApprovalPage />} />

        {/* ---------------- MEMBERS AREA ---------------- */}
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN AREA (CMS) ---------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <CMSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute>
              <AdminApprovalPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEV DEBUG PAGE ---------------- */}
        {import.meta.env.DEV && (
          <Route path="/dev-debug" element={<DevDebugPage />} />
        )}
      </Routes>
    </Layout>
  );
};

export default App;
