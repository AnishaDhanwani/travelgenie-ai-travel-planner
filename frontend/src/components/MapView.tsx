import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DayItinerary, Activity } from '../types/itinerary';
import { MapPin, Navigation, Eye, Utensils, Compass } from 'lucide-react';

interface MapViewProps {
  days: DayItinerary[];
  destination: string;
  selectedDay?: number;
}

export const MapView: React.FC<MapViewProps> = ({ days, destination, selectedDay }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [filterDay, setFilterDay] = useState<number>(selectedDay || 0); // 0 = all days
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Sync internal filter if selectedDay prop changes
  useEffect(() => {
    if (selectedDay !== undefined) {
      setFilterDay(selectedDay);
    }
  }, [selectedDay]);

  // Collect places to display based on filterDay
  const displayedDays = filterDay === 0 ? days : days.filter((d) => d.day === filterDay);
  
  const places: {
    id: string;
    name: string;
    description: string;
    day: number;
    period: string;
    category: string;
    cost: number;
    lat: number;
    lon: number;
    isFood?: boolean;
  }[] = [];

  displayedDays.forEach((d) => {
    d.activities.forEach((act, idx) => {
      if (act.latitude && act.longitude) {
        places.push({
          id: `act-${d.day}-${idx}`,
          name: act.name,
          description: act.description,
          day: d.day,
          period: act.period,
          category: act.category,
          cost: act.estimatedCost,
          lat: act.latitude,
          lon: act.longitude,
          isFood: false,
        });
      }
    });

    d.foodRecommendations.forEach((food, idx) => {
      if (food.latitude && food.longitude) {
        places.push({
          id: `food-${d.day}-${idx}`,
          name: food.restaurantName,
          description: `${food.cuisine} Cuisine • Specialty: ${food.specialty}`,
          day: d.day,
          period: food.meal,
          category: 'Food',
          cost: food.approxCost,
          lat: food.latitude,
          lon: food.longitude,
          isFood: true,
        });
      }
    });
  });

  // Initialize or update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet map instance
      const defaultCenter: [number, number] = places.length > 0
        ? [places[0].lat, places[0].lon]
        : [28.6139, 77.2090];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (places.length === 0) return;

    const latLngBounds = L.latLngBounds([]);

    places.forEach((p) => {
      const isFood = p.isFood;
      const colorBg = isFood ? '#F97316' : '#0D9488';
      const iconEmoji = isFood ? '🍴' : p.category === 'Adventure' ? '🧗' : p.category === 'Nature' ? '🌲' : '📍';

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${colorBg};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);
            border: 2px solid #ffffff;
            cursor: pointer;
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">${iconEmoji}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([p.lat, p.lon], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="background: #F1F5F9; color: #0F172A; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              Day ${p.day} • ${p.period}
            </span>
            <span style="color: #0D9488; font-size: 11px; font-weight: 700;">
              ₹${p.cost}
            </span>
          </div>
          <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #0F172A;">${p.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.4;">${p.description}</p>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'custom-map-popup' });
      markersRef.current.push(marker);
      latLngBounds.extend([p.lat, p.lon]);
    });

    if (markersRef.current.length > 0) {
      map.fitBounds(latLngBounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [places.length, filterDay]);

  const handlePlaceClick = (lat: number, lon: number, id: string) => {
    setActiveItem(id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 15, { animate: true });
      const foundMarker = markersRef.current.find(
        (m) => m.getLatLng().lat === lat && m.getLatLng().lng === lon
      );
      if (foundMarker) {
        foundMarker.openPopup();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Map Header with Day Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive Route Map</h3>
            <p className="text-xs text-slate-500">Explore attractions and restaurants geographically</p>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setFilterDay(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterDay === 0
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Days
          </button>
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setFilterDay(d.day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterDay === d.day
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[480px]">
        {/* Map Canvas */}
        <div className="lg:col-span-2 h-full relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Locations List Sidebar */}
        <div className="h-full border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto bg-slate-50/30 p-3 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            {places.length} Locations Mapped
          </div>

          {places.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 text-sm">
              No geocoded spots for this selection.
            </div>
          ) : (
            places.map((place) => (
              <div
                key={place.id}
                onClick={() => handlePlaceClick(place.lat, place.lon, place.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                  activeItem === place.id
                    ? 'bg-teal-50 border-teal-300 shadow-xs ring-1 ring-teal-200'
                    : 'bg-white border-slate-200/70 hover:border-teal-200 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    {place.isFood ? <Utensils className="w-3 h-3 text-orange-500" /> : <MapPin className="w-3 h-3 text-teal-600" />}
                    Day {place.day} • {place.period}
                  </span>
                  <span className="font-semibold text-slate-600">₹{place.cost}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-800 truncate">{place.name}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{place.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

