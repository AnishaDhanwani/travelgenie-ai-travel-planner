import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, ArrowRight, Sparkles, Filter } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const destinations = [
    {
      name: 'Manali, Himachal Pradesh',
      category: 'Mountains',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      description: 'Snowy peaks, Solang Valley adventure, Jogini waterfalls, and cozy riverside cafes.',
      approxBudget: '₹18,000 / person',
      idealDuration: '5 Days',
    },
    {
      name: 'Goa Beaches & Old Quarters',
      category: 'Beaches',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant beaches, Portuguese Fontainhas Latin Quarter, water sports & coastal curries.',
      approxBudget: '₹22,000 / person',
      idealDuration: '4 Days',
    },
    {
      name: 'Jaipur, Rajasthan',
      category: 'Heritage',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      description: 'The royal Pink City with Amber Fort, Hawa Mahal, stepwells & authentic Rajasthani thalis.',
      approxBudget: '₹15,000 / person',
      idealDuration: '3 Days',
    },
    {
      name: 'Munnar & Alleppey, Kerala',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Rolling green tea estates, peaceful backwater houseboats & spice gardens.',
      approxBudget: '₹20,000 / person',
      idealDuration: '5 Days',
    },
    {
      name: 'Kashmir Valley & Srinagar',
      category: 'Mountains',
      image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      description: 'Dal Lake shikaras, Gulmarg gondola rides, Mughal gardens & majestic alpine meadows.',
      approxBudget: '₹26,000 / person',
      idealDuration: '6 Days',
    },
    {
      name: 'Rishikesh & Haridwar',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
      description: 'Yoga retreats, white-water Ganga rafting, Aarti by the ghats & suspension bridges.',
      approxBudget: '₹12,000 / person',
      idealDuration: '3 Days',
    },
    {
      name: 'Udaipur, City of Lakes',
      category: 'Heritage',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Lake Pichola sunset boat cruises, City Palace opulence, and heritage rooftop cafes.',
      approxBudget: '₹18,000 / person',
      idealDuration: '4 Days',
    },
    {
      name: 'Varanasi Ghats',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'One of the world’s oldest living cities, morning boat rides & mystical evening ceremonies.',
      approxBudget: '₹14,000 / person',
      idealDuration: '3 Days',
    },
  ];

  const categories = ['All', 'Mountains', 'Beaches', 'Heritage', 'Nature', 'Spiritual'];

  const filtered = activeCategory === 'All'
    ? destinations
    : destinations.filter((d) => d.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
          Curated Destination Guides
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Handpicked Destinations
        </h1>
        <p className="text-sm text-slate-500">
          Select any destination to launch the AI planner with optimized defaults.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((dest) => (
          <div
            key={dest.name}
            onClick={() => navigate(`/plan?dest=${encodeURIComponent(dest.name.split(',')[0])}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-900 rounded-md shadow-2xs">
                  {dest.category}
                </span>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <h3 className="text-sm font-bold text-slate-900">{dest.name}</h3>
                <p className="text-slate-500 line-clamp-2 leading-relaxed">{dest.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
                  <span>{dest.idealDuration}</span>
                  <span className="text-teal-700 font-bold">{dest.approxBudget}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
              <span>Plan This Trip</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

