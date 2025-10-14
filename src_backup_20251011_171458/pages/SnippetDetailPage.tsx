// src/pages/SnippetsPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const SnippetsPage: React.FC = () => {
  const [snippets, setSnippets] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const data = await optimizedApi.getSnippets();
        setSnippets(data);
      } catch (err) {
        console.error("Error loading snippets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  if (loading) return <LoadingSpinner subtle={true} className="py-20" />;

  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-center text-primary-700 mb-12">
          Reflections in Stone
        </h1>

        {snippets.length === 0 ? (
          <p className="text-center text-neutral-500">
            No snippets available yet.
          </p>
        ) : (
          <div className="grid gap-8">
            {snippets.map((snippet) => (
              <Link
                key={snippet.id}
                to={`/snippets/${snippet.id}`}
                className="block bg-white rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-all duration-200 p-8"
              >
                <h2 className="text-2xl font-semibold text-primary-700 mb-3">
                  {snippet.title}
                </h2>
                <div
                  className="text-neutral-700 leading-relaxed mb-4 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      snippet.content?.length > 200
                        ? snippet.content.slice(0, 200) + "..."
                        : snippet.content,
                  }}
                />
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock size={16} className="mr-2" />
                  {snippet.publish_date
                    ? new Date(snippet.publish_date).toLocaleDateString("en-GB")
                    : "Undated"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetsPage;
