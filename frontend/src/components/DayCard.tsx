import React from 'react';
import { DayItinerary, Activity, FoodRecommendation } from '../types/itinerary';
import { Clock, Navigation, MapPin, Utensils, DollarSign, Lightbulb, Compass, Camera, Sparkles } from 'lucide-react';

interface DayCardProps {
  day: DayItinerary;
  currency: string;
}

export const DayCard: React.FC<DayCardProps> = ({ day, currency }) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Adventure':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Nature':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Culture':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Shopping':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Food':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'Morning':
        return '🌅';
      case 'Afternoon':
        return '☀️';
      case 'Evening':
        return '🌙';
      default:
        return '📍';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6 p-6">
      {/* Day Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
            Day {day.day} • {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">{day.title}</h3>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-400 block">Est. Daily Budget</span>
          <span className="text-sm font-extrabold text-slate-900">
            {currency} {day.estimatedDailyBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Planned Schedule
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {day.activities.map((act, index) => (
            <div key={index} className="relative group">
              {/* Dot on line */}
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs"></div>

              <div className="p-4 rounded-xl border border-slate-200/80 hover:border-teal-300 hover:shadow-xs transition bg-white space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{getPeriodIcon(act.period)}</span>
                    <span className="text-xs font-bold text-slate-900">{act.time}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">{act.duration}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(act.category)}`}>
                      {act.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {act.estimatedCost > 0 ? `${currency} ${act.estimatedCost}` : 'Free Entry'}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {act.name}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {act.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {act.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" />
                    {act.travelTimeFromPrevious} via {act.transportSuggestion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Recommendations */}
      {day.foodRecommendations && day.foodRecommendations.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-orange-500" />
            Recommended Dining
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.foodRecommendations.map((food, fIdx) => (
              <div
                key={fIdx}
                className="p-3.5 rounded-xl border border-orange-100 bg-orange-50/30 hover:bg-orange-50/60 transition space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-800 bg-orange-100/80 px-2 py-0.5 rounded">
                    {food.meal}
                  </span>
                  <span className="font-semibold text-slate-700">~{currency} {food.approxCost}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900">{food.restaurantName}</h5>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-700">Cuisine:</strong> {food.cuisine}
                </p>
                <p className="text-xs text-slate-500 italic">
                  Must try: {food.specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Localized Day Tips */}
      {day.travelTips && day.travelTips.length > 0 && (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start space-x-2.5">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            {day.travelTips.map((tip, tIdx) => (
              <p key={tIdx}>• {tip}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

