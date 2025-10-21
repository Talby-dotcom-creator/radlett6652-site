import React from "react";
import { LodgeEvent } from "../types";
import { getPublicUrl } from "../lib/optimizedApi";

interface EventCardProps {
  event: LodgeEvent;
  onViewDetails?: (event: LodgeEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const { title, description, event_date, location, image_path, image_url } =
    event as any;

  // ✅ Build the Supabase public image URL (if one exists)
  const imageUrl =
    image_path && !image_path.startsWith("http")
      ? getPublicUrl(
          image_path.toLowerCase().startsWith("events/")
            ? image_path
            : `Events/${image_path}`
        )
      : image_path;

  // ✅ Format the date nicely
  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date TBC";

  return (
    <div className="bg-white shadow-soft rounded-xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
      {/* Event Image */}
      <div className="aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => (e.currentTarget.src = "/placeholder-event.png")}
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-5 flex flex-col justify-between h-full text-center">
        <h3 className="text-xl font-heading font-semibold text-primary-700 mb-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 mb-3">
          {formattedDate} • {location || "Venue TBC"}
        </p>
        <p className="text-neutral-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {description || "Event details will be announced soon."}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-center gap-4">
            <a
              href="/events"
              className="inline-block mt-2 text-secondary-600 font-medium hover:text-secondary-700 transition"
            >
              Learn More →
            </a>
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(event)}
                className="inline-block mt-2 text-secondary-600 font-medium hover:text-secondary-700 transition"
                aria-label={`View details for ${title}`}
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
