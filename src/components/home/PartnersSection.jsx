
import React from "react";
import { Handshake } from "lucide-react";

const FALLBACK_PARTNERS = [
  { name: "African Fashion Council", description: "Promoting African design globally" },
  { name: "Soweto Creatives Hub", description: "Empowering township entrepreneurs" },
  { name: "SA Cotton Board", description: "Sustainable local fabric sourcing" },
  { name: "Jozi Style Magazine", description: "Johannesburg's #1 fashion publication" },
  { name: "Nkosi Textiles", description: "Premium African fabric supplier" },
  { name: "Ubuntu Foundation", description: "Community development partner" },
];

export default function PartnersSection({ partners }) {
  const display = partners.length > 0 ? partners : FALLBACK_PARTNERS;

  return (
    <section id="partners" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-2">Our Network</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">ZooKeepa Partners</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">We collaborate with organisations that share our vision of empowering African creativity and building community.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {display.map((p, i) => (
            <div key={i} className={`bg-white border border-gray-200 p-6 flex flex-col items-center text-center hover:border-yellow-400 hover:shadow-md transition-all ${p.website_url ? "cursor-pointer" : ""}`}
              onClick={() => p.website_url && window.open(p.website_url, "_blank")}>
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-12 object-contain mb-4 grayscale hover:grayscale-0 transition-all" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-yellow-600" />
                </div>
              )}
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              {p.description && <p className="text-gray-500 text-xs">{p.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}