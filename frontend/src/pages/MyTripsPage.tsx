import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripRecord } from '../types/itinerary';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import {
  Compass,
  Calendar,
  Users,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setItinerary, setPreferences } = useTrip();

  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getTrips(user?.id);
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleOpenItinerary = (trip: TripRecord) => {
    if (trip.itinerary) {
      setItinerary(trip.itinerary);
      setPreferences({
        destination: trip.destination,
        startingLocation: trip.startingLocation,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers,
        adults: trip.adults,
        children: trip.children,
        budget: trip.budget,
        budgetType: trip.budgetType,
        budgetCategory: 'Moderate',
        currency: trip.currency,
        travelStyle: trip.travelStyle as any,
        travelPace: trip.travelPace as any,
        interests: trip.interests,
        transportation: trip.transportation,
        accommodation: trip.accommodation,
        additionalRequirements: trip.additionalPreferences,
      });
      navigate('/itinerary');
    }
  };

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await api.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  const handleDuplicateTrip = async (trip: TripRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const copy = await api.saveTrip({
        ...trip,
        destination: `${trip.destination} (Copy)`,
      });
      setTrips([copy, ...trips]);
    } catch (err) {
      alert('Failed to duplicate trip');
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch = t.destination.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const totalSpend = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
            Trip Management Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            My Planned Trips
          </h1>
          <p className="text-xs text-slate-500">
            {user ? `Welcome back, ${user.name}` : 'Saved itineraries on this device'}
          </p>
        </div>

        <button
          onClick={() => navigate('/plan')}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Trips</span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{trips.length}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">Upcoming Adventures</span>
          <div className="text-xl font-extrabold text-teal-700 mt-0.5">
            {trips.filter((t) => new Date(t.startDate) >= new Date()).length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">Past Journeys</span>
          <div className="text-xl font-extrabold text-slate-700 mt-0.5">
            {trips.filter((t) => new Date(t.startDate) < new Date()).length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Budget Planned</span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">
            ₹{totalSpend.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by destination..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'planned', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Cards Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your travel collection...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-8 space-y-4">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No trips found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? 'No trips match your search term.'
              : 'You have not saved any trip itineraries yet. Click below to plan your first adventure!'}
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Plan First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const daysCount = trip.itinerary?.days?.length || 5;
            return (
              <div
                key={trip.id}
                onClick={() => handleOpenItinerary(trip)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with image or placeholder */}
                  <div className="h-36 bg-gradient-to-r from-slate-900 to-teal-900 p-4 flex flex-col justify-between text-white relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-xs uppercase tracking-wider">
                        {trip.travelStyle} • {trip.travelPace}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleDuplicateTrip(trip, e)}
                          title="Duplicate trip"
                          className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          title="Delete trip"
                          className="p-1.5 rounded-lg bg-black/30 hover:bg-red-600 text-white transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold leading-snug">{trip.destination}</h3>
                      <span className="text-[11px] text-teal-200 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {trip.startDate} to {trip.endDate} ({daysCount} Days)
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {trip.travelers} Travelers
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {trip.currency} {trip.budget.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trip.interests &&
                        trip.interests.slice(0, 3).map((int, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {int}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                  <span>View Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

