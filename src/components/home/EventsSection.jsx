import React from "react";
import { Calendar, MapPin } from "lucide-react";

export default function EventsSection({ events }) {
  const display = events?.length > 0 ? events.map(event => ({
    ...event,
    image_url: event.image_id ? `/api/images/${event.image_id}` : null
  })) : [];

  return (
    <section id="events" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase mb-2">What's Happening</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">Recent Events</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {display.map((event, i) => (
            <div key={i} className="group relative overflow-hidden">
              <div className="aspect-video overflow-hidden">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                <h3 className="font-semibold text-base mb-1">{event.title}</h3>
                {event.date && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.description && <p className="text-gray-300 text-xs line-clamp-2">{event.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}