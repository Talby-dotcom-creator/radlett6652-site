// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // ✅ add this
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import JoinPage from "./pages/JoinPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import NewsPostPage from "./pages/NewsPostPage";
import BlogPage from "./pages/BlogPage";
import SnippetsPage from "./pages/SnippetsPage";
import ContactPage from "./pages/ContactPage";
import MembersPage from "./pages/MembersPage";
// import NotFoundPage from "./pages/NotFoundPage";
import "./index.css";

function App() {
  useEffect(() => {
    // optional intersection observer, etc.
  }, []);

  return (
    <BrowserRouter>
      {/* ✅ Header is global and always visible */}
      <Header />

      {/* ✅ Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/members" element={<MembersPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
