// src/components/SnippetHighlight.tsx
import React, { useEffect, useState } from "react";
import { CMSBlogPost } from "../types";
import optimizedApi from "../lib/optimizedApi";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURE_SNIPPET_TITLE = "The weight you don't need"; // ✅ Your featured one

const SnippetHighlight: React.FC = () => {
  const [snippet, setSnippet] = useState<CMSBlogPost | null>(null);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const snippets = await optimizedApi.getBlogPosts("snippet")();

        // Find the one matching your chosen title (case-insensitive)
        const featured =
          snippets.find(
            (s) =>
              s.title?.toLowerCase().trim() ===
              FEATURE_SNIPPET_TITLE.toLowerCase().trim()
          ) || null;

        // fallback to most recent if not found
        const latest =
          featured ||
          (snippets.length > 0
            ? snippets.sort(
                (a, b) =>
                  new Date(b.publish_date || 0).getTime() -
                  new Date(a.publish_date || 0).getTime()
              )[0]
            : null);

        setSnippet(latest);
      } catch (err) {
        console.error("Error loading snippet:", err);
      }
    };

    loadSnippet();
  }, []);

  if (!snippet) return null;

  return (
    <section
      className="relative py-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/slate-texture-background.png')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative container mx-auto px-4 md:px-6 text-center max-w-4xl animate-fadeIn">
        <img
          src="/icon-192.png"
          alt="Masonic emblem"
          className="mx-auto mb-6 w-16 h-16 opacity-90 drop-shadow-md"
        />

        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 drop-shadow-lg text-chiselled">
          Reflections in Stone
        </h2>

        <div className="bg-white/95 rounded-xl p-10 shadow-2xl border border-neutral-200">
          <h3 className="text-2xl md:text-3xl font-semibold text-primary-700 mb-6">
            {snippet.title}
          </h3>

          <div
            className="prose prose-lg max-w-none text-neutral-800 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: snippet.content }}
          />

          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {snippet.publish_date
                ? new Date(snippet.publish_date).toLocaleDateString("en-GB")
                : "Undated"}
            </div>
            <Link
              to={`/snippets/${snippet.id}`}
              className="inline-flex items-center px-5 py-2 rounded-lg bg-secondary-600 text-white hover:bg-secondary-700 transition"
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SnippetHighlight;
