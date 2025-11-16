import React from "react";

interface HeroWelcomeProps {
  name?: string | null;
  subtitle?: string | null;
  nextMeetingText?: string | null; // e.g., "Next Meeting • 12 Mar"
  hint?: string | null; // e.g., "Press / to search • Ctrl/Cmd+K for actions"
  emphasis?: "subtle" | "strong"; // "strong" = darker, more obvious
  showBeta?: boolean; // temporary label so it’s unmistakable
  countdownDays?: number | null; // days remaining until the next meeting
}

const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  name,
  subtitle,
  nextMeetingText,
  hint,
  emphasis = "subtle",
  showBeta = false,
  countdownDays = null,
}) => {
  return (
    <section className="relative overflow-hidden rounded-xl border mb-6"
             aria-label="Welcome banner">
      {/* Background texture */}
      <div
        className={`absolute inset-0 bg-[url('/parchment-full.png')] bg-cover bg-center ${
          emphasis === "strong" ? "opacity-40" : "opacity-20"
        }`}
        aria-hidden="true"
      />
      {/* Gradient wash + vignette */}
      <div
        className={`absolute inset-0 ${
          emphasis === "strong"
            ? "bg-gradient-to-r from-neutral-200/70 via-white/80 to-white/60"
            : "bg-gradient-to-r from-neutral-50/90 to-white/70"
        }`}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-40px_60px_-30px_rgba(0,0,0,0.15)]" />

      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#BFA76F] via-[#d3c08a] to-transparent opacity-80" />

      <div className="relative px-4 md:px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {showBeta && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-700 text-white">
                  New
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-primary-700">
                {name ? `Welcome back, ${name}` : "Members Area"}
              </h1>
            </div>
            {subtitle && (
              <p className="text-sm md:text-base text-neutral-800">{subtitle}</p>
            )}
            {hint && <p className="text-xs text-neutral-700 mt-1">{hint}</p>}
          </div>
          {nextMeetingText && (
            <div className="shrink-0 flex flex-col items-end gap-2">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#BFA76F]/15 text-[#0B1831] text-base md:text-lg font-semibold border border-[#BFA76F] shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BFA76F]" aria-hidden />
                <span>{nextMeetingText}</span>
              </div>
              {typeof countdownDays === "number" && countdownDays >= 0 && (
                <div className="inline-flex items-baseline gap-3 px-4 py-3 rounded-xl bg-primary-50 border border-primary-300 shadow-md">
                  <span className="text-3xl md:text-4xl font-extrabold leading-none text-primary-800">
                    {countdownDays === 0 ? "Today" : countdownDays}
                  </span>
                  {countdownDays > 0 && (
                    <span className="text-base md:text-lg font-semibold text-primary-900 leading-tight">days to go</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroWelcome;
