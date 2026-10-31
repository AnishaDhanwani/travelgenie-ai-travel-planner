import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TripPreferences, BudgetCategory, BudgetType, TravelPace, TravelStyle } from '../types/itinerary';
import { api } from '../services/api';
import { useTrip } from '../context/TripContext';
import { MapPin, Calendar, DollarSign, Heart, Compass, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Loader2, Info } from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { preferences, setPreferences, setItinerary } = useTrip();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State initialized with either saved preferences or query param or smart defaults
  const [formData, setFormData] = useState<TripPreferences>(() => {
    const destParam = searchParams.get('dest') || '';
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 14);
    const endWeek = new Date();
    endWeek.setDate(nextWeek.getDate() + 4);

    return (
      preferences || {
        destination: destParam || 'Manali, Himachal Pradesh',
        startingLocation: 'New Delhi',
        startDate: nextWeek.toISOString().split('T')[0],
        endDate: endWeek.toISOString().split('T')[0],
        travelers: 2,
        adults: 2,
        children: 0,
        budget: 20000,
        budgetType: 'per_person',
        budgetCategory: 'Moderate',
        currency: 'INR',
        travelStyle: 'couple',
        travelPace: 'balanced',
        interests: ['Mountains', 'Photography', 'Food exploration', 'Adventure'],
        transportation: 'Public transport',
        accommodation: 'Standard hotel',
        additionalRequirements: 'Prefer peaceful scenic locations with good photography opportunities.',
      }
    );
  });

  useEffect(() => {
    const destParam = searchParams.get('dest');
    if (destParam) {
      setFormData((prev) => ({ ...prev, destination: destParam }));
    }
  }, [searchParams]);

  const interestOptions = [
    { id: 'Adventure', label: 'Adventure Activities', icon: '🧗' },
    { id: 'Nature', label: 'Nature & Scenery', icon: '🌲' },
    { id: 'Historical places', label: 'Historical Places', icon: '🏛️' },
    { id: 'Beaches', label: 'Beaches & Ocean', icon: '🏖️' },
    { id: 'Mountains', label: 'Mountains & Treks', icon: '⛰️' },
    { id: 'Shopping', label: 'Local Markets & Shopping', icon: '🛍️' },
    { id: 'Photography', label: 'Photography Spots', icon: '📸' },
    { id: 'Food exploration', label: 'Food & Culinary Exploration', icon: '🍲' },
    { id: 'Nightlife', label: 'Nightlife & Cafes', icon: '🍸' },
    { id: 'Cultural experiences', label: 'Cultural Experiences', icon: '🎭' },
    { id: 'Religious places', label: 'Spiritual & Sacred Places', icon: '🛕' },
    { id: 'Relaxation', label: 'Peace & Relaxation', icon: '🧘' },
  ];

  const quickRequirementChips = [
    'Avoid crowded tourist traps',
    'Prefer vegetarian restaurants',
    'Include hidden gems & quiet spots',
    'Include photography viewpoints',
    'Focus on nature and peaceful locations',
    'Keep physical walking moderate',
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleChipClick = (chip: string) => {
    setFormData((prev) => {
      const current = prev.additionalRequirements || '';
      if (current.includes(chip)) return prev;
      return {
        ...prev,
        additionalRequirements: current ? `${current}. ${chip}` : chip,
      };
    });
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.destination.trim()) {
        setError('Please enter a destination.');
        return;
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('End date must be after start date.');
        return;
      }
    } else if (step === 2) {
      if (!formData.budget || formData.budget <= 0) {
        setError('Please enter a valid trip budget.');
        return;
      }
    } else if (step === 3) {
      if (formData.interests.length === 0) {
        setError('Please select at least one travel interest.');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      setPreferences(formData);
      const generatedItinerary = await api.generateItinerary(formData);
      setItinerary(generatedItinerary);
      navigate('/itinerary');
    } catch (err: any) {
      setError(err.message || 'Failed to generate itinerary. Please try again.');
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Destination', icon: MapPin },
    { num: 2, label: 'Budget', icon: DollarSign },
    { num: 3, label: 'Interests', icon: Heart },
    { num: 4, label: 'Style & Pace', icon: Compass },
    { num: 5, label: 'Review & AI Generate', icon: Sparkles },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Plan Your Personalized AI Trip
        </h1>
        <p className="text-sm text-slate-500">
          Tell us where and how you want to travel, and our AI will build your complete day-by-day plan.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-teal-600 transition-all duration-300 -z-10"
            style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
          />
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-slate-900 text-teal-400 ring-4 ring-teal-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-6">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* STEP 1: DESTINATION & DATES */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Step 1: Destination & Travel Dates</h3>
              <p className="text-xs text-slate-500">Where are you heading and who is traveling?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination City or Region *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Manali, Himachal Pradesh"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Starting Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.startingLocation || ''}
                  onChange={(e) => setFormData({ ...formData, startingLocation: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10) || 1;
                    setFormData({ ...formData, travelers: count, adults: count });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Children</label>
                <input
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Step 2: Trip Budget</h3>
              <p className="text-xs text-slate-500">Set your financial bounds so the AI stays realistic</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Trip Budget Amount *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">
                    {formData.currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Budget Scope</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetType: 'per_person' })}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    formData.budgetType === 'per_person'
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">Per Person</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Budget applied per traveler</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetType: 'total_group' })}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    formData.budgetType === 'total_group'
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">Total Group</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Combined total for all {formData.travelers} travelers</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Spending Category</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Budget', 'Moderate', 'Luxury'] as BudgetCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetCategory: cat })}
                    className={`p-3 rounded-xl border text-center transition ${
                      formData.budgetCategory === cat
                        ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{cat}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {cat === 'Budget' ? 'Hostels & Local transit' : cat === 'Moderate' ? '3-star & Cabs' : 'Resorts & Fine dining'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERENCES */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Step 3: Travel Preferences & Interests</h3>
              <p className="text-xs text-slate-500">Select what excites you most (select all that apply)</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {interestOptions.map((opt) => {
                const selected = formData.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                      selected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: STYLE & PACE */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Step 4: Travel Style & Logistics</h3>
              <p className="text-xs text-slate-500">Define your party, pace, stay and transportation</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Travel Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['solo', 'couple', 'family', 'friends'] as TravelStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelStyle: style })}
                    className={`py-2.5 px-3 rounded-xl border text-center capitalize text-xs font-bold transition ${
                      formData.travelStyle === style
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Travel Pace</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['relaxed', 'balanced', 'packed'] as TravelPace[]).map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelPace: pace })}
                    className={`p-3 rounded-xl border text-center transition capitalize ${
                      formData.travelPace === pace
                        ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{pace}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pace === 'relaxed' ? '1-2 spots/day' : pace === 'balanced' ? '2-3 spots/day' : 'Max sights/day'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Accommodation Style</label>
                <select
                  value={formData.accommodation}
                  onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Hostel">Hostel / Backpacking dorm</option>
                  <option value="Budget hotel">Budget hotel / Guesthouse</option>
                  <option value="Standard hotel">Standard 3-star hotel</option>
                  <option value="Luxury hotel">Luxury resort / 5-star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Transportation</label>
                <select
                  value={formData.transportation}
                  onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Public transport">Public transport (Buses / Metro)</option>
                  <option value="Taxi">Private Taxi / Cabs</option>
                  <option value="Rental car">Rental Car / Bike</option>
                  <option value="Personal vehicle">Personal vehicle</option>
                  <option value="Walking">Walking / Cycling</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ADDITIONAL REQUIREMENTS & REVIEW */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Step 5: Additional Requirements & Final Review</h3>
              <p className="text-xs text-slate-500">Provide any specific preferences or restrictions</p>
            </div>

            {/* Quick Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Click to add special wishes:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickRequirementChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Free text textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tell us anything else about your ideal trip
              </label>
              <textarea
                rows={3}
                value={formData.additionalRequirements || ''}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="e.g. Avoid crowded places, prefer vegetarian restaurants, include photography viewpoints, avoid expensive attractions..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Trip Plan Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Summary of Your Travel Requirements
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Destination</span>
                  <span className="font-bold text-slate-900">{formData.destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Travel Dates</span>
                  <span className="font-bold text-slate-900">{formData.startDate} to {formData.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Budget</span>
                  <span className="font-bold text-slate-900">
                    {formData.currency} {formData.budget.toLocaleString()} ({formData.budgetType === 'per_person' ? 'Per Person' : 'Group'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Travelers</span>
                  <span className="font-bold text-slate-900">{formData.travelers} ({formData.travelStyle})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center space-x-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-7 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:scale-95 text-white rounded-xl text-sm font-extrabold transition shadow-md flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI is Crafting Your Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

