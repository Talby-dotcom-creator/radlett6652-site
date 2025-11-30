// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Public pages
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/AboutPage";
import JoinPage from "./pages/JoinPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import NewsPostPage from "./pages/NewsPostPage";
import PillarsPage from "./pages/PillarsPage";
import PillarsArchivePage from "./pages/PillarsArchivePage";
import PillarPostDetail from "./pages/PillarPostDetail";
import SnippetsPage from "./pages/SnippetsPage";
import SnippetArchivePage from "./pages/archives/SnippetArchivePage";
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
import SnippetsAdminPage from "./pages/admin/SnippetsAdminPage";
import MembersAdminPage from "./pages/admin/MembersAdminPage";

// Developer utility
import DevDebugPage from "./pages/DevDebugPage";

// Route guard
import ProtectedRoute from "./ProtectedRoute";

// ---------------------------------------------------------
// ROUTING STRUCTURE
// ---------------------------------------------------------
const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* -------------------------------------------------------------------- */}
        {/* PUBLIC + MEMBER ROUTES â€” These use the Layout (header + footer)      */}
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
                <Route path="/pillars" element={<Navigate to="/blog" replace />} />
                <Route path="/pillars/archive" element={<PillarsArchivePage />} />
                <Route path="/pillars/:slug" element={<Navigate to="/blog" replace />} />
                <Route path="/snippets" element={<SnippetsPage />} />
                <Route path="/snippets/archive" element={<SnippetArchivePage />} />
                <Route path="/faq" element={<Navigate to="/join#faq" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/reset-password" element={<PasswordResetPage />} />

                {/* ---------------- AUTH ROUTES ---------------- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pending" element={<PendingApprovalPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

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

                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/onboarding" element={<Navigate to="/members" replace />} />
                <Route path="/welcome" element={<WelcomePage />} />
                {/* Fallback redirect for unknown public routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />

        {/* -------------------------------------------------------------------- */}
        {/* ADMIN ROUTES â€” These are OUTSIDE Layout (clean white pages)          */}
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

        <Route
          path="/admin/snippets"
          element={
            <ProtectedRoute requiredRole="admin">
              <SnippetsAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/members"
          element={
            <ProtectedRoute requiredRole="admin">
              <MembersAdminPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect old path just in case */}
        <Route path="/members/admin" element={<Navigate to="/admin" replace />} />

        {/* DEV DEBUG PAGE */}
        {import.meta.env.DEV && <Route path="/dev-debug" element={<DevDebugPage />} />}
      </Routes>
    </>
  );
};

export default App;
