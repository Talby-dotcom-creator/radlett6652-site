import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSBlogPost } from "../types";

const SnippetsPage: React.FC = () => {
  const [snippets, setSnippets] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const data = await optimizedApi.getBlogPosts("snippet");
        setSnippets(data);
      } catch (err) {
        console.error("Error fetching snippets:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSnippets();
  }, []);

  return (
    <main>
      <HeroSection
        title="Reflections in Stone"
        subtitle="Short contemplations and Masonic thoughts"
        backgroundImage="/images/snippets-banner.webp"
      />
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Reflections Archive
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : snippets.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-10">
              {snippets.map((snippet) => (
                <article
                  key={snippet.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
                >
                  <h3 className="text-2xl font-heading text-primary-700 mb-3">
                    {snippet.title}
                  </h3>
                  <div
                    className="text-neutral-700 leading-relaxed prose"
                    dangerouslySetInnerHTML={{ __html: snippet.content ?? "" }}
                  />
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600">
              No reflections published yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default SnippetsPage;
