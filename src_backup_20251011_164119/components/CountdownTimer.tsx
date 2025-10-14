// src/components/CountdownTimer.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MapPin, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { cmsApi } from "../lib/cmsApi";
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
  seconds: number;
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
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<{
    id?: string;
    is_members_only?: boolean;
    date: Date;
    title: string;
    description: string;
    location: string;
    isInstallation: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // === Calculate fallback meeting schedule ===
  const calculateNextLodgeMeeting = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const meetings = [];

    const getNthWeekday = (
      year: number,
      month: number,
      weekday: number,
      occurrence: number
    ) => {
      const firstDay = new Date(year, month, 1);
      const firstWeekday = firstDay.getDay();
      const firstOccurrence = 1 + ((weekday - firstWeekday + 7) % 7);
      const targetDate = firstOccurrence + (occurrence - 1) * 7;
      return new Date(year, month, targetDate, 18, 0);
    };

    for (const year of [currentYear, currentYear + 1]) {
      meetings.push({
        date: getNthWeekday(year, 1, 6, 2),
        title: "Regular Lodge Meeting",
        description:
          "February regular meeting of Radlett Lodge No. 6652. Festive Board to follow.",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(year, 3, 6, 1),
        title: "Regular Lodge Meeting",
        description:
          "April regular meeting of Radlett Lodge No. 6652. Festive Board to follow.",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(year, 6, 6, 2),
        title: "Regular Lodge Meeting",
        description:
          "July regular meeting of Radlett Lodge No. 6652. Festive Board to follow.",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(year, 8, 6, 1),
        title: "Regular Lodge Meeting",
        description:
          "September regular meeting of Radlett Lodge No. 6652. Festive Board to follow.",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: false,
      });
      meetings.push({
        date: getNthWeekday(year, 11, 6, 2),
        title: "Installation Meeting",
        description:
          "Annual Installation of the Worshipful Master and Officers. Festive Board to follow.",
        location: "Radlett Masonic Centre, Rose Walk, Radlett",
        isInstallation: true,
      });
    }

    return meetings
      .filter((m) => m.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  };

  // === Load next event from CMS or fallback ===
  const fetchNextEvent = useCallback(async () => {
    try {
      setLoading(true);
      const nextEvent = await cmsApi.getNextUpcomingEvent();
      if (nextEvent) {
        return {
          id: nextEvent.id,
          date: new Date(nextEvent.event_date),
          title: nextEvent.title,
          description: nextEvent.description,
          location: nextEvent.location,
          isInstallation: nextEvent.title
            .toLowerCase()
            .includes("installation"),
          is_members_only: nextEvent.is_members_only,
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

  // === Countdown Timer Logic ===
  useEffect(() => {
    const loadMeetingData = async () => {
      let targetMeeting = null;
      if (useSchedule) {
        targetMeeting = await fetchNextEvent();
        if (!targetMeeting) targetMeeting = calculateNextLodgeMeeting();
        setNextMeeting(targetMeeting);
      }

      const finalTargetDate =
        targetMeeting?.date || (targetDate ? new Date(targetDate) : null);

      if (!finalTargetDate) {
        setIsExpired(true);
        return;
      }

      const updateTime = () => {
        const diff = finalTargetDate.getTime() - new Date().getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setTimeLeft({ days, hours, minutes, seconds });
          setIsExpired(false);
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsExpired(true);
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);
      return () => clearInterval(timer);
    };

    loadMeetingData();
  }, [targetDate, useSchedule, fetchNextEvent]);

  const displayTitle = nextMeeting?.title || eventTitle || "Next Lodge Meeting";
  const displayLocation = nextMeeting?.location || eventLocation;
  const isInstallation = nextMeeting?.isInstallation || false;

  // === Base Wrapper ===
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
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-800/60">
            <LoadingSpinner subtle={true} className="text-white" />
          </div>
        )}
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

  // === Display Countdown ===
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

          {isInstallation && (
            <p className="text-lg text-secondary-300 mb-4">
              Annual Installation Ceremony
            </p>
          )}

          {/* Timer Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => {
              const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i];
              return (
                <div
                  key={label}
                  className="bg-white/10 rounded-lg p-4 backdrop-blur-sm shadow-soft"
                >
                  <div className="text-3xl md:text-4xl font-heading font-bold text-secondary-500">
                    {value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-neutral-100 mt-1">{label}</div>
                </div>
              );
            })}
          </div>

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
