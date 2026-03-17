import React, { useState } from "react";
import { X } from "lucide-react";

const FALLBACK_IMAGES = [
  { image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", caption: "Street Style Lookbook" },
  { image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", caption: "Summer Collection" },
  { image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80", caption: "Safari Edit" },
  { image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", caption: "New Arrivals" },
  { image_url: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&q=80", caption: "Wild Textures" },
  { image_url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", caption: "Runway Moments" },
  { image_url: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80", caption: "Accessories" },
  { image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", caption: "Team Shoot" },
];

export default function GallerySection({ items }) {
  const [lightbox, setLightbox] = useState(null);
  const display = items?.length > 0 ? items : FALLBACK_IMAGES;

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-2">Visual Stories</p>
        <h2 className="brand-font text-4xl md:text-5xl font-semibold">Gallery</h2>
        <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {display.map((item, i) => (
          <div
            key={i}
            className="break-inside-avoid cursor-pointer overflow-hidden group relative"
            onClick={() => setLightbox(item)}
          >
            <img
              src={item.image_url}
              alt={item.caption || ""}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {item.caption && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs tracking-wider">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-yellow-400">
            <X className="w-8 h-8" />
          </button>
          <img src={lightbox.image_url} alt={lightbox.caption} className="max-h-[90vh] max-w-full object-contain" onClick={e => e.stopPropagation()} />
          {lightbox.caption && <p className="absolute bottom-6 text-white text-sm tracking-wider">{lightbox.caption}</p>}
        </div>
      )}
    </section>
  );
}