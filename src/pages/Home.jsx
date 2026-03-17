import React, { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import GallerySection from "../components/home/GallerySection";
import EventsSection from "../components/home/EventsSection";
import PartnersSection from "../components/home/PartnersSection";
import TeamSection from "../components/home/TeamSection";
import CareersSection from "../components/home/CareersSection";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [team, setTeam] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Promise.resolve([]),
      Promise.resolve([]),
      Promise.resolve([]),
      Promise.resolve([]),
      Promise.resolve([]),
    ]).then(([g, e, p, t, c]) => {
      setGallery(g);
      setEvents(e);
      setPartners(p);
      setTeam(t);
      setCareers(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <GallerySection items={gallery} />
      <EventsSection events={events} />
      <PartnersSection partners={partners} />
      <TeamSection members={team} />
      <CareersSection careers={careers} />
      <ContactSection />
    </div>
  );
}