import React, { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import GallerySection from "../components/home/GallerySection";
import EventsSection from "../components/home/EventsSection";
import PartnersSection from "../components/home/PartnersSection";
import TeamSection from "../components/home/TeamSection";
import CareersSection from "../components/home/CareersSection";
import ContactSection from "../components/home/ContactSection";
import { galleryAPI, eventsAPI, partnersAPI, teamAPI, careersAPI } from "@/api/apiService";

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [team, setTeam] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [galleryData, eventsData, partnersData, teamData, careersData] = await Promise.all([
          galleryAPI.getAll(),
          eventsAPI.getAll(),
          partnersAPI.getAll(),
          teamAPI.getAll(),
          careersAPI.getAll(),
        ]);

        setGallery(galleryData);
        setEvents(eventsData);
        setPartners(partnersData);
        setTeam(teamData);
        setCareers(careersData);
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Set empty arrays on error to prevent crashes
        setGallery([]);
        setEvents([]);
        setPartners([]);
        setTeam([]);
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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