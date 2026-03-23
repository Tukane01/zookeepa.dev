import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function GallerySection({ items }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load gallery');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          // Transform data to include image URLs
          const transformedData = data.map(item => ({
            ...item,
            image_url: item.image_id ? `/api/images/${item.image_id}` : null
          })).filter(item => item.image_url); // Only show items with images
          setGalleryItems(transformedData);
        }
      })
      .catch(err => {
        console.error('Failed to load gallery:', err);
        setGalleryItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const display = galleryItems.length > 0 ? galleryItems : (items?.length > 0 ? items : []);

  if (loading && galleryItems.length === 0) {
    return (
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-2">Visual Stories</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">Gallery</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </section>
    );
  }

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
            key={item.id || i}
            className="break-inside-avoid cursor-pointer overflow-hidden group relative"
            onClick={() => setLightbox(item)}
          >
            <img
              src={item.image_url}
              alt={item.caption || item.alt_text || ""}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {(item.caption || item.alt_text) && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs tracking-wider">{item.caption || item.alt_text}</p>
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