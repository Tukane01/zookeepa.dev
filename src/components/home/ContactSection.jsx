import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default marker icon
if (L?.Icon?.Default?.prototype?._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
if (L?.Icon?.Default?.mergeOptions) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export default function ContactSection() {
  const [settings, setSettings] = useState({
    contact_address: "14 Fox Street, Maboneng Precinct",
    contact_city: "Johannesburg",
    contact_province: "Gauteng",
    contact_zip: "2094",
    contact_country: "South Africa",
    contact_phone: "+27 11 555 0100",
    contact_email: "hello@zookeepa.com",
    contact_hours: "Mon – Fri: 9:00 – 18:00\nSaturday: 9:00 – 16:00\nSunday: 10:00 – 14:00",
    map_lat: -26.2041,
    map_lng: 28.0473
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const s = data[0];
          setSettings(prev => ({ ...prev, ...s }));
        }
      })
      .catch(err => console.error('Failed to load contact settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const LAT = parseFloat(settings.map_lat) || -26.2041;
  const LNG = parseFloat(settings.map_lng) || 28.0473;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-2">Find Us</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">Visit & Contact</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h3 className="brand-font text-2xl font-semibold mb-4">ZooKeepa Flagship Store</h3>
              <p className="text-gray-500 leading-relaxed">Come experience ZooKeepa in person. Browse the full collection, meet our team, and feel the energy of the brand in our signature space.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Physical Address</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {settings.contact_address}<br />
                    {settings.contact_city}, {settings.contact_zip}<br />
                    {settings.contact_province && `${settings.contact_province}, `}{settings.contact_country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Store Hours</p>
                  <p className="text-gray-500 text-sm mt-0.5 whitespace-pre-line">{settings.contact_hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="text-gray-500 text-sm hover:text-yellow-600">
                    {settings.contact_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <a href={`mailto:${settings.contact_email}`} className="text-gray-500 text-sm hover:text-yellow-600">
                    {settings.contact_email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-96 border border-gray-200 overflow-hidden rounded-none z-0">
            {!loading && (
              <MapContainer key={`${LAT}-${LNG}`} center={[LAT, LNG]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[LAT, LNG]}>
                  <Popup>
                    <div className="text-center">
                      <strong>ZooKeepa Flagship Store</strong><br />
                      {settings.contact_address}<br />
                      {settings.contact_city}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}