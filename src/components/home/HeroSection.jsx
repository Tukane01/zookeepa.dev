import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState(null);
  const [heroData, setHeroData] = useState({
    title: "ZOO<span className=\"text-yellow-400\">KEEPA</span>",
    subtitle: "More than clothing — a movement. Bold designs, wild spirit, African soul.",
    ctaText: "Shop Now"
  });

  useEffect(() => {
    // Fetch site settings for hero section
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const settings = data[0];
          setHeroData({
            title: settings.hero_title || heroData.title,
            subtitle: settings.hero_subtitle || heroData.subtitle,
            ctaText: settings.hero_cta_text || heroData.ctaText
          });
          if (settings.hero_image_id) {
            setHeroImage(`/api/images/${settings.hero_image_id}`);
          }
        }
      })
      .catch(err => console.error('Failed to load hero settings:', err));
  }, []);

  const defaultBackgroundImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";

  return (
    <section
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage || defaultBackgroundImage})`
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-yellow-400 text-xs tracking-[0.5em] uppercase mb-5">Johannesburg, South Africa · Est. 2024</p>
        <h1 className="brand-font text-6xl md:text-8xl font-bold text-white leading-tight mb-6">
          <span dangerouslySetInnerHTML={{ __html: heroData.title }} />
        </h1>
        <p className="text-gray-200 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
          {heroData.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-3 tracking-widest text-sm rounded-none h-12">
            <Link to={createPageUrl("Shop")}>
              <ShoppingBag className="w-4 h-4 mr-2" /> {heroData.ctaText}
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black px-10 py-3 tracking-widest text-sm rounded-none h-12 bg-transparent">
            <a href="#gallery">
              Explore
            </a>
          </Button>
        </div>
      </div>
      {/* Scroll indicator */}
      <a href="#gallery" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </a>

      {/* Nav anchors */}
      <nav className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm hidden md:flex items-center justify-center gap-10 py-3">
        {[
          { label: "Gallery", href: "#gallery" },
          { label: "Events", href: "#events" },
          { label: "Partners", href: "#partners" },
          { label: "Team", href: "#team" },
          { label: "Careers", href: "#careers" },
          { label: "Contact", href: "#contact" },
        ].map(l => (
          <a key={l.label} href={l.href} className="text-xs tracking-[0.3em] uppercase text-gray-300 hover:text-yellow-400 transition-colors">
            {l.label}
          </a>
        ))}
      </nav>
    </section>
  );
}