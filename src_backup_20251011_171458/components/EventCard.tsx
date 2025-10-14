// src/components/EventCard.tsx
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "../types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // ✅ Safely handle event date to avoid "Invalid time value" errors
  let formattedDate = "Date TBA";
  if (event.event_date) {
    const parsed = new Date(event.event_date);
    if (!isNaN(parsed.getTime())) {
      formattedDate = format(parsed, "dd MMM yyyy");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-200">
      <div>
        {/* Event Title */}
        <h3 className="text-xl font-semibold text-primary-700 mb-2">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-neutral-600 mb-4 line-clamp-3">
          {event.description || "Details to be announced."}
        </p>
      </div>

      <div className="text-sm text-neutral-500 space-y-2 mt-2">
        {/* Event Date */}
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-secondary-500" />
          {formattedDate}
        </div>

        {/* Event Location */}
        {event.location && (
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-secondary-500" />
            {event.location}
          </div>
        )}

        {/* Members Only Tag */}
        {event.is_members_only && (
          <div className="flex items-center text-secondary-600 font-medium">
            <Users size={16} className="mr-2 text-secondary-500" />
            Members Only
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
