import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Sparkles, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Travel<span className="text-teal-400">Genie</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your intelligent AI travel co-pilot. Custom itineraries, dynamic route maps, budget optimization, and local insights powered by Generative AI.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Built with Google Gemini & OpenStreetMap</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Explore Destinations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/plan?dest=Manali" className="hover:text-teal-400 transition">Manali, Himachal Pradesh</Link></li>
              <li><Link to="/plan?dest=Goa" className="hover:text-teal-400 transition">Goa Beaches & Heritage</Link></li>
              <li><Link to="/plan?dest=Jaipur" className="hover:text-teal-400 transition">Jaipur Royal Palaces</Link></li>
              <li><Link to="/plan?dest=Kerala" className="hover:text-teal-400 transition">Kerala Backwaters & Tea Gardens</Link></li>
              <li><Link to="/plan?dest=Kashmir" className="hover:text-teal-400 transition">Kashmir Valley & Gulmarg</Link></li>
            </ul>
          </div>

          {/* Application Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Key Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-teal-400" /> Budget Optimization Engine</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> OpenStreetMap Integration</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-teal-400" /> Natural Language Modification</li>
              <li className="flex items-center gap-1.5"><Compass className="w-3 h-3 text-teal-400" /> Weather & Climate Advisories</li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">About TravelGenie</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Full-Stack Generative AI Web Application designed for seamless traveler journeys and budget precision.
            </p>
            <div className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} TravelGenie AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

