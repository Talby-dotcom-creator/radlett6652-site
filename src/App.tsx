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
import ProfilePage from "./pages/ProfilePage";
import DirectoryPage from "./pages/DirectoryPage";
import CMSPage from "./pages/CMSPage";
import AdminPage from "./pages/AdminPage";
import AdminApprovalPage from "./pages/AdminApprovalPage";
import PillarsAdminPage from "./pages/admin/PillarsAdminPage";
import MinutesAdminPage from "./pages/admin/MinutesAdminPage";
import DocumentsAdminPage from "./pages/admin/DocumentsAdminPage";

// Developer utility
import DevDebugPage from "./pages/DevDebugPage";

// Route guard
import ProtectedRoute from "./ProtectedRoute";

// ---------------------------------------------------------
// ROUTING STRUCTURE
// ---------------------------------------------------------
const App: React.FC = () => {
  return (
    <Routes>
      {/* -------------------------------------------------------------------- */}
      {/* PUBLIC + MEMBER ROUTES — These use the Layout (header + footer)      */}
      {/* -------------------------------------------------------------------- */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsPostPage />} />
              <Route path="/blog" element={<PillarsPage />} />
              <Route path="/blog/:slug" element={<PillarPostDetail />} />
              <Route
                path="/pillars"
                element={<Navigate to="/blog" replace />}
              />
              <Route
                path="/pillars/:slug"
                element={<Navigate to="/blog" replace />}
              />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route
                path="/faq"
                element={<Navigate to="/join#faq" replace />}
              />
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
                  <ProtectedRoute requiredRole="member">
                    <MembersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/profile"
                element={
                  <ProtectedRoute requiredRole="member">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/directory"
                element={
                  <ProtectedRoute requiredRole="member">
                    <DirectoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback redirect for unknown public routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        }
      />

      {/* -------------------------------------------------------------------- */}
      {/* ADMIN ROUTES — These are OUTSIDE Layout (clean white pages)          */}
      {/* -------------------------------------------------------------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <CMSPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminApprovalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pillars"
        element={
          <ProtectedRoute requiredRole="admin">
            <PillarsAdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/minutes"
        element={
          <ProtectedRoute requiredRole="admin">
            <MinutesAdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/documents"
        element={
          <ProtectedRoute requiredRole="admin">
            <DocumentsAdminPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect old path just in case */}
      <Route path="/members/admin" element={<Navigate to="/admin" replace />} />

      {/* DEV DEBUG PAGE */}
      {import.meta.env.DEV && (
        <Route path="/dev-debug" element={<DevDebugPage />} />
      )}
    </Routes>
  );
};

export default App;
