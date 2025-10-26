// src/pages/PillarsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock } from "lucide-react";
import SEOHead from "../components/SEOHead";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { optimizedApi as cmsApi } from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";

// --- Page config ---
const CATEGORIES = [
  { key: "all", label: "All Posts" },
  { key: "philosophy", label: "Philosophy & Thought" },
  { key: "history", label: "History & Heritage" },
  { key: "community", label: "Community & Service" },
  { key: "stories", label: "Member Stories" },
  { key: "seeking", label: "For Those Seeking" },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];

// --- Helpers ---
const placeholder = (i = 0) =>
  [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop", // abstract columns
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop", // people meeting
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop", // community
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop", // notebook
  ][i % 4];

const formatDate = (iso?: string | null) => {
  try {
    return iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  } catch {
    return "";
  }
};

const readingTime = (content?: string) => {
  if (!content) return "5 min read";
  const words = content.split(/\s+/).length;
  const mins = Math.max(3, Math.round(words / 200));
  return `${mins} min read`;
};

// --- Demo fallbacks if CMS unavailable ---
const demoPosts: CMSBlogPost[] = [
  {
    id: "demo-1",
    title: "The Foundation of Brotherhood",
    excerpt:
      "Exploring the timeless bonds that unite Freemasons across generations and cultures.",
    content: "Long form text here...",
    cover_image_url: placeholder(0),
    publish_date: new Date().toISOString(),
    category: "philosophy",
    author_name: "Editorial Team",
    slug: "foundation-of-brotherhood",
  } as any,
  {
    id: "demo-2",
    title: "Why I Became a Freemason",
    excerpt:
      "A personal story of discovery, growth, and finding purpose in service.",
    content: "Story content...",
    cover_image_url: placeholder(1),
    publish_date: new Date().toISOString(),
    category: "stories",
    author_name: "A Member",
    slug: "why-i-became-a-freemason",
  } as any,
  {
    id: "demo-3",
    title: "Making a Difference: Our Community Service Projects",
    excerpt:
      "From local food drives to mentoring, small acts create lasting impact.",
    content: "Community content...",
    cover_image_url: placeholder(2),
    publish_date: new Date().toISOString(),
    category: "community",
    author_name: "Community Team",
    slug: "community-service-projects",
  } as any,
  {
    id: "demo-4",
    title: "Tracing the Pillars: History & Heritage",
    excerpt:
      "A brief journey through symbolism, craft, and the lessons we carry forward.",
    content: "History content...",
    cover_image_url: placeholder(3),
    publish_date: new Date().toISOString(),
    category: "history",
    author_name: "Lodge Historian",
    slug: "pillars-history-heritage",
  } as any,
];

// --- Components ---
const WatermarkSC: React.FC = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 opacity-10"
    width="420"
    height="420"
    viewBox="0 0 420 420"
    fill="none"
  >
    <defs>
      <filter id="emboss" x="-50%" y="-50%" width="200%" height="200%">
        <feOffset dx="0" dy="1" />
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite
          in="SourceGraphic"
          in2="blur"
          operator="arithmetic"
          k2="-1"
          k3="1"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"
        />
      </filter>
    </defs>
    {/* Simple stylised Square & Compasses */}
    <g
      filter="url(#emboss)"
      stroke="currentColor"
      strokeWidth="8"
      className="text-neutral-400"
    >
      <path d="M210 40 L320 330" />
      <path d="M210 40 L100 330" />
      <circle cx="210" cy="210" r="40" fill="transparent" />
      <path d="M110 330 H310" />
      <path d="M170 260 L250 260" />
    </g>
  </svg>
);

const CategoryPills: React.FC<{
  active: CatKey;
  onChange: (c: CatKey) => void;
}> = ({ active, onChange }) => (
  <div className="mt-6 flex flex-wrap gap-3">
    {CATEGORIES.map(({ key, label }) => {
      const selected = key === active;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            "rounded-full px-4 py-2 text-sm transition",
            selected
              ? "bg-neutral-900 text-white shadow"
              : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50",
          ].join(" ")}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const FeaturedCard: React.FC<{ post: CMSBlogPost }> = ({ post }) => (
  <article className="relative grid gap-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 md:grid-cols-12">
    <div className="relative md:col-span-6">
      <img
        src={(post as any).cover_image_url ?? post.image_url ?? placeholder(0)}
        alt={post.title}
        className="h-64 w-full object-cover md:h-full"
        loading="lazy"
      />
      <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
        Featured
      </span>
    </div>
    <div className="md:col-span-6 p-6 md:p-8">
      <p className="text-xs font-semibold tracking-wide text-amber-700">
        {labelFromCategory(post.category as CatKey)}
      </p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
        {post.title}
      </h3>
      <p className="mt-3 text-neutral-600">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <Calendar size={16} />{" "}
          {formatDate(post.publish_date ?? post.created_at)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={16} /> {readingTime(post.content ?? "")}
        </span>
      </div>
      <div className="mt-6">
        <Link to={`/pillars/${post.slug}`} className="btn btn-primary">
          Read Article
        </Link>
      </div>
    </div>
  </article>
);

function labelFromCategory(key?: CatKey | string) {
  const found = CATEGORIES.find((c) => c.key === key);
  return found ? found.label : "Philosophy & Thought";
}

const Card: React.FC<{ post: CMSBlogPost; index: number }> = ({
  post,
  index,
}) => (
  <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
    <div className="relative">
      <img
        src={
          (post as any).cover_image_url ??
          post.image_url ??
          placeholder(index + 1)
        }
        alt={post.title}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        {labelFromCategory(post.category as CatKey)}
      </p>
      <h3 className="mt-1 text-lg font-bold text-neutral-900">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-neutral-600">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <Calendar size={16} />{" "}
          {formatDate(post.publish_date ?? post.created_at)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={16} /> {readingTime(post.content ?? "")}
        </span>
      </div>
      <div className="mt-5">
        <Link to={`/pillars/${post.slug}`} className="btn btn-primary">
          Read Article
        </Link>
      </div>
    </div>
  </article>
);

// --- Page ---
const PillarsPage: React.FC = () => {
  const [posts, setPosts] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CatKey>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // Try CMS first
        const live = await cmsApi.getBlogPosts?.();
        if (!cancelled) {
          if (Array.isArray(live) && live.length) {
            setPosts(live as CMSBlogPost[]);
          } else {
            setPosts(demoPosts);
          }
        }
      } catch {
        if (!cancelled) setPosts(demoPosts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const byCat =
      category === "all"
        ? posts
        : posts.filter((p) => (p.category as any) === category);
    const term = q.trim().toLowerCase();
    if (!term) return byCat;
    return byCat.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.excerpt?.toLowerCase().includes(term) ||
        (p.content || "").toLowerCase().includes(term)
    );
  }, [posts, category, q]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <SEOHead
        title="The Pillars"
        description="Wisdom, knowledge, and insights on the journey from darkness to light."
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-6 md:pt-28">
        {/* Watermark */}
        <WatermarkSC />

        {/* Title + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
            <span className="inline-block">
              The{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Pillars
              </span>
            </span>
          </h1>
          <p className="mt-3 text-center text-neutral-600 md:text-lg">
            Wisdom, knowledge, and insights on the journey from darkness to
            light
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="flex items-center gap-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-neutral-200">
              <Search className="ml-1 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search articles…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-full border-none bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="rounded-full px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category filters */}
          <CategoryPills active={category} onChange={setCategory} />
        </motion.div>

        {/* Content */}
        <div className="relative mt-10">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner subtle />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-neutral-800">
                No articles found
              </p>
              <p className="mt-1 text-neutral-600">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FeaturedCard post={featured} />
                </motion.div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {rest.map((p, i) => (
                    <motion.div
                      key={p.id || i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(i * 0.05, 0.25),
                      }}
                    >
                      <Card post={p} index={i} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PillarsPage;
