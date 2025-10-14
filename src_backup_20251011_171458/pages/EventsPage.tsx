import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSEvent } from "../types";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CMSEvent[]>([]);
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
        title="Lodge Events"
        subtitle="Discover upcoming meetings, socials, and special gatherings"
        backgroundImage="/images/events-banner.webp"
      />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Upcoming Events
          </h2>

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
