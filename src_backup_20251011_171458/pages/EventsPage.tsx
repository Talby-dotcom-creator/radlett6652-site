// src/pages/EventsPage.tsx
console.log("📅 EventsPage loaded!");
import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { Event } from "../types";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await optimizedApi.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <main>
      <HeroSection
        title="Events Calendar"
        subtitle="Stay up to date with all Lodge meetings and social events."
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/radlett_event.png"
        overlayOpacity={0.35}
        verticalPosition="bottom"
        showScrollHint
      />
    </main>
  );
};

export default EventsPage;
