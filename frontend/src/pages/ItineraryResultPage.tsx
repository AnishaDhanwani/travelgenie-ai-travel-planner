import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { exportItineraryToPDF } from '../services/pdfExport';
import { DayCard } from '../components/DayCard';
import { MapView } from '../components/MapView';
import { BudgetDashboard } from '../components/BudgetDashboard';
import { WeatherCard } from '../components/WeatherCard';
import { AIModificationPanel } from '../components/AIModificationPanel';
import { BudgetOptimizerModal } from '../components/BudgetOptimizerModal';
import {
  MapPin,
  Calendar,
  Users,
  Download,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Edit3,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Briefcase,
  Check,
  Layers,
} from 'lucide-react';

export const ItineraryResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, itinerary, setItinerary, pushHistory, undoModification, canUndo, activeDay, setActiveDay } = useTrip();
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!itinerary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Itinerary Generated Yet</h2>
        <p className="text-sm text-slate-500">
          Start by telling our AI your destination, budget, and travel preferences.
        </p>
        <button
          onClick={() => navigate('/plan')}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Start Planning Trip
        </button>
      </div>
    );
  }

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      await api.saveTrip({
        userId: user?.id,
        destination: itinerary.destination,
        startingLocation: preferences?.startingLocation,
        startDate: preferences?.startDate || itinerary.days[0]?.date,
        endDate: preferences?.endDate || itinerary.days[itinerary.days.length - 1]?.date,
        travelers: preferences?.travelers || 1,
        adults: preferences?.adults || 1,
        children: preferences?.children || 0,
        budget: preferences?.budget || itinerary.totalEstimatedBudget,
        budgetType: preferences?.budgetType || 'per_person',
        currency: itinerary.currency,
        travelStyle: preferences?.travelStyle || 'couple',
        travelPace: preferences?.travelPace || 'balanced',
        interests: preferences?.interests || ['Sightseeing'],
        transportation: preferences?.transportation || 'Public transport',
        accommodation: preferences?.accommodation || 'Standard hotel',
        status: 'planned',
        itinerary,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Could not save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!preferences) return;
    setRegenerating(true);
    try {
      const refreshed = await api.generateItinerary(preferences);
      pushHistory(refreshed);
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate');
    } finally {
      setRegenerating(false);
    }
  };

  const currentDayData = itinerary.days.find((d) => d.day === activeDay) || itinerary.days[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 rounded-md border border-teal-200/60">
                {itinerary.destination}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                {itinerary.days.length} Days
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                Version {itinerary.version || 1}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {itinerary.tripTitle}
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed italic">
              "{itinerary.summary}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/plan')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center space-x-1.5 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Trip</span>
            </button>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center space-x-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${regenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            <button
              onClick={handleSaveTrip}
              disabled={saving}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs ${
                savedSuccess
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {savedSuccess ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to Trips</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Trip'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => exportItineraryToPDF(itinerary, preferences || undefined)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Total Estimated Cost</span>
            <span className="text-sm font-extrabold text-slate-900">
              {itinerary.currency} {itinerary.totalEstimatedBudget.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Avg. Daily Cost</span>
            <span className="text-sm font-extrabold text-slate-900">
              {itinerary.currency} {Math.round(itinerary.totalEstimatedBudget / itinerary.days.length).toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Travelers</span>
            <span className="text-sm font-extrabold text-slate-900">
              {preferences?.travelers || 1} ({itinerary.travelStyle || 'Leisure'})
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Pace</span>
            <span className="text-sm font-extrabold text-slate-900 capitalize">
              {itinerary.travelPace || 'Balanced'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Category</span>
            <span className="text-sm font-extrabold text-slate-900">
              {itinerary.budgetCategory || 'Moderate'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Schedule (2 Cols) | Right Utilities (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Day-Wise Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {itinerary.days.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
                  activeDay === d.day
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Day {d.day}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeDay === d.day ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'}`}>
                  {d.activities.length} spots
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Schedule Card */}
          {currentDayData && <DayCard day={currentDayData} currency={itinerary.currency} />}

          {/* Interactive Map View */}
          <MapView
            days={itinerary.days}
            destination={itinerary.destination}
            selectedDay={activeDay}
          />
        </div>

        {/* Right Column: AI Co-Pilot, Budget Dashboard, Weather & Packing */}
        <div className="space-y-6">
          {/* AI Modification Panel */}
          <AIModificationPanel
            itinerary={itinerary}
            onItineraryModified={(newItin) => pushHistory(newItin)}
            onUndo={undoModification}
            canUndo={canUndo}
            userBudget={preferences?.budget}
          />

          {/* Budget Dashboard Card */}
          <BudgetDashboard
            itinerary={itinerary}
            userBudget={preferences?.budget || itinerary.totalEstimatedBudget}
            travelers={preferences?.travelers || 1}
            onOpenOptimizer={() => setIsOptimizerOpen(true)}
          />

          {/* Weather & Climate Card */}
          <WeatherCard
            destination={itinerary.destination}
            startDate={preferences?.startDate || itinerary.days[0]?.date}
          />

          {/* Packing Suggestions & Tips */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" />
              Packing Essentials
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              {itinerary.packingSuggestions && itinerary.packingSuggestions.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Local Customs & Safety Tips
              </span>
              <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                {itinerary.travelTips.slice(0, 3).map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Optimizer Modal */}
      <BudgetOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        itinerary={itinerary}
        userBudget={preferences?.budget || itinerary.totalEstimatedBudget}
        travelers={preferences?.travelers || 1}
        onApplyOptimization={(updated) => {
          pushHistory(updated);
        }}
      />
    </div>
  );
};

