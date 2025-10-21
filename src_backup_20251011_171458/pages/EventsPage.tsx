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


      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-neutral-50 rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-neutral-700 mb-2">
                    📅{" "}
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-neutral-600 mb-3">
                    📍 {event.location || "Location to be confirmed"}
                  </p>
                  <p className="text-neutral-700 text-sm">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600">
              No upcoming events at this time.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default EventsPage;
