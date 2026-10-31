import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types/itinerary';
import { api } from '../services/api';
import { Cloud, Sun, CloudRain, Wind, Droplets, Info, Sparkles } from 'lucide-react';

interface WeatherCardProps {
  destination: string;
  startDate?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ destination, startDate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getWeather(destination, startDate)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Weather fetch failed:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination, startDate]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-100 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-slate-100 rounded w-full"></div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Destination Climate & Weather</h4>
            <span className="text-[11px] text-slate-500">{weather.city}</span>
          </div>
        </div>

        {weather.isForecastAvailable ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Live Forecast
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
            Seasonal Climate Advisory
          </span>
        )}
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-teal-50/30 p-4 rounded-xl border border-sky-100">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{weather.temperature}°</span>
            <span className="text-sm font-semibold text-slate-500">C</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 capitalize mt-0.5">
            {weather.condition} • {weather.description}
          </p>
          <span className="text-[11px] text-slate-500">Feels like {weather.feelsLike}°C</span>
        </div>

        {/* Weather Conditions details */}
        <div className="space-y-1.5 text-right text-xs text-slate-600">
          <div className="flex items-center justify-end space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end space-x-1.5">
            <CloudRain className="w-3.5 h-3.5 text-teal-600" />
            <span>Rain Chance: {weather.rainProbability || 10}%</span>
          </div>
          <div className="flex items-center justify-end space-x-1.5">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Wind: {weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>

      {/* Seasonal Packing & Travel Advisory */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Travel Advice:</strong> {weather.seasonalAdvisory}
        </p>
      </div>

      {/* Multi-Day Forecast Pills */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            5-Day Outlook
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {weather.forecast.map((f, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 block truncate">
                  {new Date(f.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-xs font-bold text-slate-800 block my-0.5">
                  {f.tempDay}°
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{f.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

