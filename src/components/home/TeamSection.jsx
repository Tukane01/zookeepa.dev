import React from "react";
import { User } from "lucide-react";

const FALLBACK_TEAM = [
  { name: "Sipho Dlamini", role: "Founder & Creative Director", bio: "Visionary behind the ZooKeepa brand, with 10+ years in African fashion.", image_url: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&q=80" },
  { name: "Naledi Khumalo", role: "Head of Design", bio: "Award-winning designer merging traditional African patterns with contemporary cuts.", image_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { name: "Thabo Mokoena", role: "Operations Director", bio: "Ensuring every ZooKeepa product reaches you with quality and care.", image_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80" },
  { name: "Lerato Sithole", role: "Marketing & Brand Manager", bio: "Spreading the ZooKeepa story across Africa and beyond.", image_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80" },
  { name: "Kagiso Molefe", role: "Lead Developer", bio: "Building the digital experience that connects our community worldwide.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Zanele Nkosi", role: "Customer Experience", bio: "Your happiness is our mission — Zanele makes sure every customer feels valued.", image_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" },
];

export default function TeamSection({ members }) {
  const display = members?.length > 0 ? members : FALLBACK_TEAM;

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