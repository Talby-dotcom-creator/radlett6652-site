// src/components/CountdownTimer.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MapPin, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizedApi } from "../lib/optimizedApi";
import LoadingSpinner from "./LoadingSpinner";

interface CountdownTimerProps {
  targetDate?: string;
  eventTitle?: string;
  eventLocation?: string;
  useSchedule?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  eventTitle,
  eventLocation,
  useSchedule = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isFinalDay, setIsFinalDay] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<{
    id?: string;
    date: Date;
    title: string;
    description: string;
    location: string;
    isInstallation: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // === Fallback meeting generator ===
  const calculateNextLodgeMeeting = () => {
    const now = new Date();
    const year = now.getFullYear();
    const meetings = [];

    const getNthWeekday = (
      y: number,
      m: number,
      weekday: number,
      occurrence: number
    ) => {
      const first = new Date(y, m, 1);
      const day = first.getDay();
      const offset = (weekday - day + 7) % 7;
      return new Date(y, m, 1 + offset + (occurrence - 1) * 7, 18, 0);
    };

    for (const yr of [year, year + 1]) {
      meetings.push({
        date: getNthWeekday(yr, 1, 6, 2),
        title: "Regular Lodge Meeting",
        description: "February meeting of Radlett Lodge No. 6652",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(yr, 3, 6, 1),
        title: "Regular Lodge Meeting",
        description: "April meeting of Radlett Lodge No. 6652",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(yr, 6, 6, 2),
        title: "Regular Lodge Meeting",
        description: "July meeting of Radlett Lodge No. 6652",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(yr, 8, 6, 1),
        title: "Regular Lodge Meeting",
        description: "September meeting of Radlett Lodge No. 6652",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(yr, 11, 6, 2),
        title: "Installation Meeting",
        description: "Installation of the Worshipful Master and Officers",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: true,
      });
    }

    return meetings
      .filter((m) => m.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  };

  // === Load from Supabase or fallback ===
  const fetchNextEvent = useCallback(async () => {
    try {
      setLoading(true);
      const nextEvent = await optimizedApi.getNextUpcomingEvent();
      if (nextEvent) {
        return {
          id: nextEvent.id,
          date: new Date(nextEvent.event_date),
          title: nextEvent.title,
          description: nextEvent.description ?? "",
          location: nextEvent.location ?? "",
          isInstallation: nextEvent.title
            .toLowerCase()
            .includes("installation"),
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching next event:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // === Countdown Logic ===
  useEffect(() => {
    const loadMeeting = async () => {
      let targetMeeting = null;
      if (useSchedule) {
        targetMeeting = await fetchNextEvent();
        if (!targetMeeting) targetMeeting = calculateNextLodgeMeeting();
        setNextMeeting(targetMeeting);
      }

      const finalDate =
        targetMeeting?.date || (targetDate ? new Date(targetDate) : null);
      if (!finalDate) return setIsExpired(true);

      const updateTime = () => {
        const diff = finalDate.getTime() - Date.now();
        if (diff <= 0) {
          setIsExpired(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0 });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);

        setTimeLeft({ days, hours, minutes });
        setIsFinalDay(days === 0);
      };

      updateTime();

      // 🕒 Reduced update frequency
      const msLeft = finalDate.getTime() - Date.now();
      const interval =
        msLeft > 24 * 60 * 60 * 1000 ? 60 * 60 * 1000 : 60 * 1000;
      const timer = setInterval(updateTime, interval);

      return () => clearInterval(timer);
    };

    loadMeeting();
  }, [targetDate, useSchedule, fetchNextEvent]);

  const displayTitle = nextMeeting?.title || eventTitle || "Next Lodge Meeting";
  const displayLocation = nextMeeting?.location || eventLocation;
  const isInstallation = nextMeeting?.isInstallation || false;

  const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-16 bg-gradient-to-b from-primary-900 to-primary-800 text-white text-center"
    >
      {children}
    </motion.section>
  );

  if (isExpired) {
    return (
      <SectionWrapper>
        <div className="max-w-2xl mx-auto">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-secondary-500 animate-goldPulse" />
          <h2 className="text-3xl font-heading font-bold mb-2">
            Meeting Concluded
          </h2>
          <p className="text-lg text-neutral-100">
            Check our Events page for upcoming meetings.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-800/60">
          <LoadingSpinner subtle={true} className="text-white" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {isInstallation ? (
            <Crown className="w-16 h-16 mx-auto mb-4 text-secondary-500 animate-goldPulse" />
          ) : (
            <Clock className="w-16 h-16 mx-auto mb-4 text-secondary-500 animate-goldPulse" />
          )}

          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-secondary-300">
            {displayTitle}
          </h2>

          <AnimatePresence mode="wait">
            {!isFinalDay ? (
              <motion.div
                key="days-only"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="my-8"
              >
                <div className="text-6xl md:text-7xl font-heading font-bold text-secondary-500">
                  {timeLeft.days}
                </div>
                <div className="text-lg text-neutral-100 mt-2">
                  {timeLeft.days === 1 ? "Day to go" : "Days to go"}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="final-day"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4 my-8"
              >
                {[
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white/10 rounded-lg p-4 backdrop-blur-sm shadow-soft"
                  >
                    <div className="text-3xl md:text-4xl font-heading font-bold text-secondary-500">
                      {value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-neutral-100 mt-1">{label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {displayLocation && (
            <div className="flex items-center justify-center text-neutral-50 mb-2">
              <MapPin size={18} className="mr-2" />
              <span>{displayLocation}</span>
            </div>
          )}

          {nextMeeting && (
            <p className="text-sm text-neutral-200">
              {nextMeeting.date.toLocaleDateString("en-GB")} at{" "}
              {nextMeeting.date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          <div className="mt-6">
            <a
              href="/events"
              className="inline-block px-6 py-3 border border-secondary-400 text-secondary-300 hover:bg-secondary-500 hover:text-primary-900 transition rounded-full text-sm font-medium"
            >
              View All Events
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CountdownTimer;
