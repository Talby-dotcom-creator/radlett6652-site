import React from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { LodgeEvent } from "../types";

interface EventCardProps {
  event: LodgeEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="radlett-card group">
      <div className="radlett-card-content">
        <h3 className="text-xl font-heading font-semibold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
          {event.title}
        </h3>
        <p className="flex items-center text-sm text-neutral-600 mb-2">
          <CalendarDays className="w-4 h-4 mr-2 text-secondary-500" />
          {event.event_date
            ? new Date(event.event_date).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Date TBC"}
        </p>
        {event.location && (
          <p className="flex items-center text-sm text-neutral-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-secondary-500" />
            {event.location}
          </p>
        )}
        {event.description && (
          <p className="text-neutral-700 text-sm mb-4 line-clamp-3">
            {event.description}
          </p>
        )}
        <Link
          to="/events"
          className="text-secondary-500 font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
