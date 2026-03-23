import React from "react";
import { User } from "lucide-react";

export default function TeamSection({ members }) {
  const display = members?.length > 0 ? members.map(member => ({
    ...member,
    image_url: member.image_id ? `/api/images/${member.image_id}` : null
  })) : [];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-2">The People Behind the Brand</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">Development Team</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {display.map((member, i) => (
            <div key={i} className="text-center group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-transparent group-hover:border-yellow-400 transition-all">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-base">{member.name}</h3>
              <p className="text-yellow-600 text-xs tracking-wider uppercase mt-0.5">{member.role}</p>
              {member.bio && <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">{member.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}