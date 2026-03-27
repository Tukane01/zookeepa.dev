import React, { useState } from "react";
import { Briefcase, MapPin, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersSection({ careers }) {
  const [expanded, setExpanded] = useState(null);
  const display = careers?.length > 0 ? careers : [];

  const TYPE_COLORS = {
    "Full-time": "bg-green-100 text-green-800",
    "Part-time": "bg-blue-100 text-blue-800",
    "Contract": "bg-purple-100 text-purple-800",
    "Internship": "bg-yellow-100 text-yellow-800",
  };

  return (
    <section id="careers" className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase mb-2">Join The Pack</p>
          <h2 className="brand-font text-4xl md:text-5xl font-semibold">Careers</h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mt-4" />
          <p className="text-gray-400 mt-4">We're building a team of bold creatives, thinkers, and doers. If you're passionate about African fashion, we want to hear from you.</p>
        </div>

        <div className="space-y-3">
          {display.map((job, i) => (
            <div key={i} className="border border-gray-700 hover:border-yellow-500 transition-colors">
              <button
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{job.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[job.type] || "bg-gray-700 text-gray-300"}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.department}</span>
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>}
                  </div>
                </div>
                {expanded === i ? <ChevronUp className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />}
              </button>
              {expanded === i && (
                <div className="px-5 pb-5 border-t border-gray-700 pt-4">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{job.description}</p>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-none text-xs tracking-wider px-6">
                <a href={`mailto:careers@zookeepa.com?subject=Application: ${job.title}`} className="flex items-center">
                      <Send className="w-5 h-5 mr-2 inline" /> Apply Now
                </a>
              </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Don't see your role? Send your CV to <a href="mailto:careers@zookeepa.com" className="text-yellow-400 hover:underline">careers@zookeepa.com</a>
        </p>
      </div>
    </section>
  );
}