import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { optimizedApi as api } from "../lib/optimizedApi";
import { LodgeEvent } from "../types";

const UpcomingEventSpotlight: React.FC = () => {
  const [nextEvent, setNextEvent] = useState<LodgeEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNextEvent = async () => {
      try {
        const events = await api.getEvents();

        const now = new Date();
        const upcoming = events
          .filter(
            (e: LodgeEvent) => !!e.event_date && new Date(e.event_date) > now
          )
          .sort((a: LodgeEvent, b: LodgeEvent) => {
            const at = a.event_date ? new Date(a.event_date).getTime() : 0;
            const bt = b.event_date ? new Date(b.event_date).getTime() : 0;
            return at - bt;
          });

        setNextEvent(upcoming[0] || null);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNextEvent();
  }, []);

  const daysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  return (
    <section className="py-24 bg-[#f9f9f6] text-center">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-oxford-blue mb-2">
          Upcoming Event Spotlight
        </h2>
        <p className="text-neutral-600 mb-10">Next on the Lodge Calendar</p>

        {loading ? (
          <p className="text-neutral-500">Loading event...</p>
        ) : nextEvent ? (
          <div className="max-w-2xl mx-auto bg-white shadow-xl border border-yellow-500/30 rounded-2xl py-10 px-8 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-white rounded-full p-3 shadow-lg">
              <CalendarDays className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-heading text-primary-700 mb-4">
              {nextEvent.title}
            </h3>

            {nextEvent.event_date && (
              <p className="text-lg font-semibold text-yellow-600 mb-2">
                {daysUntilEvent(nextEvent.event_date)}{" "}
                {daysUntilEvent(nextEvent.event_date) === 1
                  ? "Day to go"
                  : "Days to go"}
              </p>
            )}

            <p className="text-sm text-neutral-700 mb-6 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-600" />
              {nextEvent.location ?? "Venue TBA"}
            </p>

            {nextEvent.event_date && (
              <p className="text-sm text-neutral-500 mb-6">
                {new Date(nextEvent.event_date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(nextEvent.event_date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}

            <Link
              to="/events"
              aria-label="View all events"
              className="inline-block border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition rounded-full px-6 py-2 font-medium"
            >
              View All Events
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white shadow-md border border-neutral-200 rounded-2xl py-10 px-8">
            <h3 className="text-xl font-heading text-neutral-700 mb-2">
              No upcoming events
            </h3>
            <p className="text-sm text-neutral-500">
              Please check back soon for our next Lodge meeting or social night.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventSpotlight;
