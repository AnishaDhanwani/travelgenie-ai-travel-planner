import React, { createContext, useContext, useState } from 'react';
import { TripPreferences, Itinerary } from '../types/itinerary';

interface TripContextType {
  preferences: TripPreferences | null;
  setPreferences: (prefs: TripPreferences) => void;
  itinerary: Itinerary | null;
  setItinerary: (itin: Itinerary) => void;
  history: Itinerary[];
  pushHistory: (itin: Itinerary) => void;
  undoModification: () => void;
  canUndo: boolean;
  activeDay: number;
  setActiveDay: (day: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<TripPreferences | null>(() => {
    const saved = sessionStorage.getItem('travelgenie_prefs');
    return saved ? JSON.parse(saved) : null;
  });

  const [itinerary, setItineraryState] = useState<Itinerary | null>(() => {
    const saved = sessionStorage.getItem('travelgenie_itinerary');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<Itinerary[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);

  const setPreferencesAndStore = (prefs: TripPreferences) => {
    setPreferences(prefs);
    sessionStorage.setItem('travelgenie_prefs', JSON.stringify(prefs));
  };

  const setItinerary = (itin: Itinerary) => {
    setItineraryState(itin);
    sessionStorage.setItem('travelgenie_itinerary', JSON.stringify(itin));
  };

  const pushHistory = (itin: Itinerary) => {
    if (itinerary) {
      setHistory((prev) => [...prev, itinerary]);
    }
    setItinerary(itin);
  };

  const undoModification = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, h.length - 1));
      setItinerary(prev);
    }
  };

  return (
    <TripContext.Provider
      value={{
        preferences,
        setPreferences: setPreferencesAndStore,
        itinerary,
        setItinerary,
        history,
        pushHistory,
        undoModification,
        canUndo: history.length > 0,
        activeDay,
        setActiveDay,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within a TripProvider');
  return context;
};

