// src/components/ReflectionsInStone.tsx
import React, { useEffect, useRef, useState } from "react";

type Props = {
  /** path to your wall image in /public (no logo baked in) */
  wallSrc?: string;
  /** path to your real crest, e.g. /images/radlett-crest.png */
  crestSrc?: string;
  /** “Reflections in Stone” main heading (carved) */
  title?: string;
  /** small carved line under the title */
  subline?: string;
  /** the weekly snippet as HTML (double-spaced in the panel) */
  snippetHtml?: string;
};

const ReflectionsInStone: React.FC<Props> = ({
  wallSrc = "/images/reflections-wall.jpg",
  crestSrc = "/images/radlett-crest.png",
  title = "Reflections in Stone",
  subline = "Founded 1948",
  snippetHtml,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setInView(true);
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url("${wallSrc}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* dark vignette for contrast */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)] md:bg-[rgba(0,0,0,0.3)]" />

      <div className="relative z-10 w-full max-w-5xl px-4 md:px-6">
        {/* Crest */}
        <div className="w-full flex justify-center mb-6 md:mb-8">
          <img
            src={crestSrc}
            alt="Radlett Lodge crest"
            className={`h-16 md:h-24 lg:h-28 object-contain transition-opacity ${
              inView ? "opacity-90" : "opacity-0"
            }`}
            style={{
              filter:
                "grayscale(0.15) sepia(0.18) saturate(0.9) brightness(0.95) contrast(1.05)",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* Carved heading */}
        <div className="text-center mb-5 md:mb-6">
          <h2
            className={`carved-heading ${
              inView ? "fade-etch sheen" : "pre-etch"
            }`}
          >
            {title}
          </h2>
          <p
            className={`carved-sub ${
              inView ? "fade-etch-delayed" : "pre-etch"
            }`}
          >
            {subline}
          </p>
        </div>

        {/* Snippet panel */}
        <div
          className={`mx-auto max-w-3xl rounded-xl border border-white/15 bg-neutral-900/35 backdrop-blur-[2px] p-5 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
            inView ? "animate-[fadeIn_0.8s_ease-out_forwards]" : "opacity-0"
          }`}
        >
          {snippetHtml ? (
            <div
              className="prose prose-invert max-w-none leading-loose md:leading-loose text-[1.05rem] md:text-[1.125rem]"
              // Weekly text goes here (double-spaced look via leading-loose)
              dangerouslySetInnerHTML={{ __html: snippetHtml }}
            />
          ) : (
            <p className="text-stone-100/90 leading-loose">
              (Your weekly reflection will appear here.)
            </p>
          )}
        </div>
      </div>

      {/* component-scoped styles */}
      <style>{`
        .carved-heading{
          font-family: ui-serif, "Cormorant Garamond", Georgia, "Times New Roman", serif;
          font-weight: 700;
          font-size: clamp(1.8rem, 4.5vw, 3rem);
          letter-spacing: 0.02em;
          color: #cfcac0; /* warm stone */
          text-shadow:
            0 1px 0 #fff8,
            0 -1px 0 rgba(0,0,0,0.45),
            0 2px 3px rgba(0,0,0,0.35);
          -webkit-text-stroke: 0.3px rgba(0,0,0,0.25);
          position: relative;
          display: inline-block;
        }
        .carved-sub{
          margin-top: .25rem;
          font-size: clamp(.9rem, 2.2vw, 1.05rem);
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #c7c1b5;
          text-shadow:
            0 1px 0 #fff6,
            0 -1px 0 rgba(0,0,0,0.35);
          -webkit-text-stroke: 0.25px rgba(0,0,0,0.2);
        }
        .pre-etch{ opacity:0; filter: blur(4px); transform: translateY(6px); }
        .fade-etch{
          animation: fadeEtch .9s ease-out forwards;
        }
        .fade-etch-delayed{
          animation: fadeEtch 1s ease-out .15s forwards;
        }
        @keyframes fadeEtch{
          0% { opacity:0; filter: blur(4px); transform: translateY(6px); letter-spacing:.04em; }
          100% { opacity:1; filter: blur(0); transform: translateY(0); letter-spacing:.02em; }
        }
        /* sheen sweep */
        .sheen::after{
          content:"";
          position:absolute; inset:-6px -12px;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.32) 35%, transparent 70%);
          transform: translateX(-140%);
          mix-blend-mode: overlay;
          animation: sheen 2.8s ease .6s forwards;
          pointer-events:none;
        }
        @keyframes sheen{ to { transform: translateX(140%);} }
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px)} to {opacity:1; transform:none} }
      `}</style>
    </section>
  );
};

export default ReflectionsInStone;
