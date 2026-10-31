import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, MapPin, Calendar, DollarSign, ArrowRight, ShieldCheck, Star, Users, Navigation } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickDest, setQuickDest] = useState('');

  const popularDestinations = [
    {
      name: 'Manali, Himachal',
      tagline: 'Snow-capped peaks, pine valleys & alpine adventure',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      badge: 'Mountains & Adventure',
      query: 'Manali',
    },
    {
      name: 'Goa Beaches & Heritage',
      tagline: 'Golden coastlines, Portuguese villas & vibrant seafood',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      badge: 'Beaches & Relaxation',
      query: 'Goa',
    },
    {
      name: 'Jaipur, Rajasthan',
      tagline: 'Pink City palaces, royal forts & gemstone bazaars',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      badge: 'Culture & Heritage',
      query: 'Jaipur',
    },
    {
      name: 'Kashmir Valley & Gulmarg',
      tagline: 'Paradise on earth, shikara rides & snow slopes',
      image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      badge: 'Romantic & Scenic',
      query: 'Kashmir',
    },
    {
      name: 'Kerala Backwaters & Munnar',
      tagline: 'Emerald tea plantations, houseboats & Ayurvedic wellness',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      badge: 'Nature & Serenity',
      query: 'Kerala',
    },
    {
      name: 'Rishikesh & Ganga Ghats',
      tagline: 'Yoga capital, river rafting & peaceful Himalayan foothills',
      image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
      badge: 'Spirituality & Thrills',
      query: 'Rishikesh',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDest.trim()) {
      navigate(`/plan?dest=${encodeURIComponent(quickDest.trim())}`);
    } else {
      navigate('/plan');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Soft decorative background gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.100),theme(colors.slate.50))] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] h-[400px] bg-gradient-to-tr from-teal-200/40 via-cyan-100/30 to-blue-200/40 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Next-Gen Travel AI Engine</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-teal-700">Gemini 2.5 & OpenStreetMap</span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Your Next Adventure, <br />
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Planned by AI.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Discover destinations, create personalized itineraries, and plan unforgettable journeys tailored to your budget, travel style, and pace.
            </p>
          </div>

          {/* Quick Search & Planning CTA Bar */}
          <div className="max-w-xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl shadow-slate-200/70 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center flex-1 px-3 py-1.5 w-full">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={quickDest}
                  onChange={(e) => setQuickDest(e.target.value)}
                  placeholder="Where do you want to go? (e.g. Manali, Goa, Paris...)"
                  className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Popular:</span>
              {['Manali', 'Goa', 'Jaipur', 'Kerala', 'Rishikesh'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/plan?dest=${tag}`)}
                  className="hover:text-teal-700 hover:underline transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
            Effortless Journey Planning
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How TravelGenie Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-slate-500">
            No more opening 50 browser tabs or spending hours researching routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Enter Your Preferences</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tell us your destination, dates, budget limit, interests (mountains, photography, culture), travel pace, and transport choices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-black text-lg shadow-xs">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Let AI Architect the Route</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our Generative AI engine groups attractions geographically, schedules realistic transit, checks budgets, and recommends authentic dining.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Explore, Modify & Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualize spots on an interactive OpenStreetMap, tweak the schedule using natural language chat, optimize your budget, and export a ready-to-print PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
              Trending Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Popular Spots to Spark Your Wanderlust
            </h2>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/plan?dest=${encodeURIComponent(dest.query)}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-900 rounded-md shadow-xs">
                  {dest.badge}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-base font-bold drop-shadow-xs">{dest.name}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2">{dest.tagline}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-teal-700">
                  <span>Create Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Built for Smart Travelers
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Everything You Need for a Seamless Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <h4 className="text-sm font-bold text-white">Smart Itinerary AI</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured JSON generated by Gemini, strictly obeying budget constraints and opening schedules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <DollarSign className="w-6 h-6 text-teal-400" />
            <h4 className="text-sm font-bold text-white">Budget Optimizer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time variance alerts and 1-click alternative swaps for expensive attractions and cabs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <Navigation className="w-6 h-6 text-teal-400" />
            <h4 className="text-sm font-bold text-white">Interactive Route Maps</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              OpenStreetMap integration with verified geocoded coordinates, day filters, and place popups.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <Compass className="w-6 h-6 text-teal-400" />
            <h4 className="text-sm font-bold text-white">Natural Language Edits</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Say "Make it cheaper" or "Add photography spots" and watch the itinerary adapt dynamically.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Loved by Travelers</h2>
          <p className="text-xs text-slate-500">Trusted by solo backpackers, couples, and family adventurers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "TravelGenie planned our 5-day Manali trip down to the hour. The budget optimization feature alone saved us ₹4,500 on local transit!"
            </p>
            <div className="text-xs font-bold text-slate-900">— Rohan & Priya M.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The natural language modification is magic. I typed 'replace adventure sports with peaceful temples' and it updated the whole 3rd day seamlessly."
            </p>
            <div className="text-xs font-bold text-slate-900">— Ananya K., Solo Traveler</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Exporting the PDF took one click and had all the day tables, restaurant specialties, and tips ready to print for my family."
            </p>
            <div className="text-xs font-bold text-slate-900">— Vikram S., Family Trip</div>
          </div>
        </div>
      </section>
    </div>
  );
};

