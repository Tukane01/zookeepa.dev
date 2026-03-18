import React, { useState, useEffect } from "react";

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
      <div className="h-[60vh] flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-400">Hero Section Coming Soon</h1>
      </div>
      <div className="py-20 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Gallery Section</h2>
        <p className="text-gray-500">Coming Soon</p>
      </div>
      <div className="py-20 px-4 text-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Events Section</h2>
        <p className="text-gray-500">Coming Soon</p>
      </div>
      <div className="py-20 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Contact Section</h2>
        <p className="text-gray-500">Coming Soon</p>
      </div>
    </div>
  );
}