// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import JoinPage from "./pages/JoinPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import NewsPostPage from "./pages/NewsPostPage";
import BlogPage from "./pages/BlogPage";
import PillarsPage from "./pages/PillarsPage";
import SnippetsPage from "./pages/SnippetsPage";
import ContactPage from "./pages/ContactPage";
import MembersPage from "./pages/MembersPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import PillarPostDetail from "./pages/PillarPostDetail";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />
        <Route path="/blog" element={<PillarsPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/pillars" element={<PillarsPage />} />
        <Route path="/pillars/:slug" element={<PillarPostDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;
