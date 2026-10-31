import React from 'react';
import { BudgetBreakdown, Itinerary } from '../types/itinerary';
import { DollarSign, AlertTriangle, CheckCircle, PieChart, TrendingUp, Sparkles, Car, Home, Utensils, Ticket, MoreHorizontal } from 'lucide-react';

interface BudgetDashboardProps {
  itinerary: Itinerary;
  userBudget: number;
  travelers: number;
  onOpenOptimizer: () => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  itinerary,
  userBudget,
  travelers,
  onOpenOptimizer,
}) => {
  const totalCost = itinerary.totalEstimatedBudget;
  const currency = itinerary.currency || 'INR';
  const effectiveTarget = itinerary.budgetType === 'per_person' ? userBudget * travelers : userBudget;
  const diff = totalCost - effectiveTarget;
  const isOver = diff > 0;
  const utilization = Math.round((totalCost / Math.max(1, effectiveTarget)) * 100);

  const breakdown = itinerary.budgetBreakdown;

  const categories = [
    { label: 'Accommodation', amount: breakdown.accommodation, icon: Home, color: 'bg-indigo-500', barBg: 'bg-indigo-50' },
    { label: 'Transportation', amount: breakdown.transportation, icon: Car, color: 'bg-blue-500', barBg: 'bg-blue-50' },
    { label: 'Food & Dining', amount: breakdown.food, icon: Utensils, color: 'bg-amber-500', barBg: 'bg-amber-50' },
    { label: 'Activities', amount: breakdown.activities, icon: Ticket, color: 'bg-teal-500', barBg: 'bg-teal-50' },
    { label: 'Miscellaneous', amount: breakdown.miscellaneous, icon: MoreHorizontal, color: 'bg-slate-500', barBg: 'bg-slate-50' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Budget & Expense Dashboard</h3>
            <p className="text-xs text-slate-500">Visual estimate breakdown and spending optimization</p>
          </div>
        </div>

        <button
          onClick={onOpenOptimizer}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Optimize Budget with AI</span>
        </button>
      </div>

      {/* Over-budget Warning / Under-budget Banner */}
      {isOver ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h5 className="font-bold text-red-800">
              Itinerary exceeds target budget by {currency} {diff.toLocaleString()}
            </h5>
            <p className="text-red-700 text-xs mt-0.5">
              Click "Optimize Budget with AI" to automatically find free viewpoints, low-cost transit, and alternative activities without losing trip quality.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h5 className="font-bold text-emerald-800">
              Within Budget: {currency} {Math.abs(diff).toLocaleString()} remaining buffer
            </h5>
            <p className="text-emerald-700 text-xs mt-0.5">
              Your planned activities and stay fit comfortably within your defined {currency} {effectiveTarget.toLocaleString()} limit.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500">Target Budget</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {currency} {effectiveTarget.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            {itinerary.budgetType === 'per_person' ? `${travelers} travelers` : 'Total group'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500">Total Planned</span>
          <div className={`text-base font-extrabold mt-0.5 ${isOver ? 'text-red-600' : 'text-slate-900'}`}>
            {currency} {totalCost.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Estimated cost</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500">Cost Per Person</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {currency} {Math.round(totalCost / Math.max(1, travelers)).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Per traveler</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500">Utilization</span>
          <div className={`text-base font-extrabold mt-0.5 ${isOver ? 'text-red-600' : utilization > 85 ? 'text-amber-600' : 'text-teal-700'}`}>
            {utilization}%
          </div>
          <span className="text-[10px] text-slate-400">{isOver ? 'Over budget' : 'On track'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-600">
          <span>Budget Utilization</span>
          <span className="font-bold">{utilization}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOver ? 'bg-red-500' : utilization > 85 ? 'bg-amber-500' : 'bg-teal-600'
            }`}
            style={{ width: `${Math.min(100, utilization)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Expense by Category</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const pct = Math.round((cat.amount / Math.max(1, totalCost)) * 100);
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    {cat.label}
                  </span>
                  <span className="font-bold text-slate-900">
                    {currency} {cat.amount.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

