import React, { useState } from 'react';
import { Itinerary } from '../types/itinerary';
import { api } from '../services/api';
import { Sparkles, Send, Undo2, Check, ArrowRight, Wand2, RefreshCw } from 'lucide-react';

interface AIModificationPanelProps {
  itinerary: Itinerary;
  onItineraryModified: (newItinerary: Itinerary) => void;
  onUndo: () => void;
  canUndo: boolean;
  userBudget?: number;
}

export const AIModificationPanel: React.FC<AIModificationPanelProps> = ({
  itinerary,
  onItineraryModified,
  onUndo,
  canUndo,
  userBudget,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewItinerary, setPreviewItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    'Make this trip cheaper',
    'Replace adventure activities with peaceful places',
    'Add more photography locations',
    'Include vegetarian restaurants',
    'Make the itinerary more relaxed',
  ];

  const handleApplyModification = async (instruction: string) => {
    if (!instruction.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const modified = await api.modifyItinerary(itinerary, instruction, userBudget);
      setPreviewItinerary(modified);
    } catch (err: any) {
      setError(err.message || 'Failed to apply modification');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPreview = () => {
    if (previewItinerary) {
      onItineraryModified(previewItinerary);
      setPreviewItinerary(null);
      setPrompt('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700/60 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">AI Itinerary Co-Pilot</h4>
            <p className="text-[11px] text-slate-400">Modify activities, food, or pacing in plain English</p>
          </div>
        </div>

        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Edit</span>
          </button>
        )}
      </div>

      {/* Quick Suggestions Chips */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1.5">
          Quick Adjustments
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => {
                setPrompt(qp);
                handleApplyModification(qp);
              }}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-teal-900/60 border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              + {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyModification(prompt)}
          placeholder="e.g. Add 2 photography spots on Day 2 or reduce budget..."
          disabled={loading}
          className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <button
          onClick={() => handleApplyModification(prompt)}
          disabled={loading || !prompt.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Apply</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      {/* Preview Dialog */}
      {previewItinerary && (
        <div className="p-4 rounded-xl bg-slate-800/95 border border-teal-500/50 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Modification Preview (Version {(itinerary.version || 1) + 1})
            </span>
            <span className="text-xs font-semibold text-slate-300">
              New Est: {previewItinerary.currency} {previewItinerary.totalEstimatedBudget.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
            "{previewItinerary.summary}"
          </p>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              onClick={() => setPreviewItinerary(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPreview}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

