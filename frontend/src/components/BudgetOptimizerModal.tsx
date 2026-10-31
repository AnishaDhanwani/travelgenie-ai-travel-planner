import React, { useState, useEffect } from 'react';
import { Itinerary, BudgetOptimizationSuggestion } from '../types/itinerary';
import { api } from '../services/api';
import { X, Sparkles, TrendingDown, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface BudgetOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
  userBudget: number;
  travelers: number;
  onApplyOptimization: (updatedItinerary: Itinerary) => void;
}

export const BudgetOptimizerModal: React.FC<BudgetOptimizerModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  userBudget,
  travelers,
  onApplyOptimization,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .optimizeBudget(itinerary, userBudget, travelers)
        .then((data) => {
          setAnalysis(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, itinerary, userBudget, travelers]);

  if (!isOpen) return null;

  const handleApply = (suggestion: BudgetOptimizationSuggestion) => {
    // Clone itinerary and apply
    const updated = JSON.parse(JSON.stringify(itinerary)) as Itinerary;

    if (suggestion.targetActivityIndex && suggestion.replacementActivity) {
      const { dayIndex, activityIndex } = suggestion.targetActivityIndex;
      if (updated.days[dayIndex]?.activities[activityIndex]) {
        const oldCost = updated.days[dayIndex].activities[activityIndex].estimatedCost;
        const newCost = suggestion.replacementActivity.estimatedCost || 0;
        const savings = Math.max(0, oldCost - newCost);

        Object.assign(updated.days[dayIndex].activities[activityIndex], suggestion.replacementActivity);
        updated.days[dayIndex].estimatedDailyBudget = Math.max(0, updated.days[dayIndex].estimatedDailyBudget - savings);
        updated.budgetBreakdown.activities = Math.max(0, updated.budgetBreakdown.activities - savings);
        updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - savings);
      }
    } else if (suggestion.actionType === 'change_transport') {
      updated.budgetBreakdown.transportation = Math.max(0, updated.budgetBreakdown.transportation - suggestion.potentialSavings);
      updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - suggestion.potentialSavings);
    } else if (suggestion.actionType === 'change_stay') {
      updated.budgetBreakdown.accommodation = Math.max(0, updated.budgetBreakdown.accommodation - suggestion.potentialSavings);
      updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - suggestion.potentialSavings);
    }

    setAppliedIds([...appliedIds, suggestion.id]);
    onApplyOptimization(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Budget Optimization Engine</h3>
              <p className="text-xs text-slate-500">Intelligent substitutions to maximize travel value</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-600">Analyzing expenses and finding alternatives...</p>
            </div>
          ) : analysis ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Current Cost</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {itinerary.currency} {analysis.totalEstimatedCost.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Target Budget</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {itinerary.currency} {analysis.effectiveTargetBudget.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[11px] font-semibold text-teal-700">Cost / Person</span>
                  <div className="text-sm font-extrabold text-teal-800 mt-0.5">
                    {itinerary.currency} {analysis.costPerPerson.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Value Optimizations
                </h4>

                {analysis.suggestions && analysis.suggestions.length > 0 ? (
                  analysis.suggestions.map((sug: BudgetOptimizationSuggestion) => {
                    const isApplied = appliedIds.includes(sug.id);
                    return (
                      <div
                        key={sug.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-teal-200 bg-white hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {sug.category}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" />
                              Save ~{itinerary.currency} {sug.potentialSavings.toLocaleString()}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-800">{sug.title}</h5>
                          <p className="text-xs text-slate-500">{sug.description}</p>
                        </div>

                        <button
                          onClick={() => handleApply(sug)}
                          disabled={isApplied}
                          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                            isApplied
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply Change</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-600">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    Your itinerary is already well-optimized for this budget category!
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

