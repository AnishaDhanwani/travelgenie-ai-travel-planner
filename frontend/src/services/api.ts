import { TripPreferences, Itinerary, TripRecord, WeatherData, BudgetOptimizationSuggestion } from '../types/itinerary';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const api = {
  // AI Endpoints
  async generateItinerary(preferences: TripPreferences): Promise<Itinerary> {
    const res = await fetch(`${API_BASE}/ai/generate-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to generate itinerary');
    return json.data;
  },

  async modifyItinerary(
    existingItinerary: Itinerary,
    modificationPrompt: string,
    userBudget?: number
  ): Promise<Itinerary> {
    const res = await fetch(`${API_BASE}/ai/modify-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ existingItinerary, modificationPrompt, userBudget }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to modify itinerary');
    return json.data;
  },

  async optimizeBudget(
    itinerary: Itinerary,
    targetBudget: number,
    travelers: number
  ): Promise<{
    totalEstimatedCost: number;
    costPerPerson: number;
    effectiveTargetBudget: number;
    isOverBudget: boolean;
    difference: number;
    budgetUtilizationPercentage: number;
    suggestions: BudgetOptimizationSuggestion[];
  }> {
    const res = await fetch(`${API_BASE}/ai/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary, targetBudget, travelers }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to optimize budget');
    return json.data;
  },

  // Trips CRUD Endpoints
  async saveTrip(trip: Partial<TripRecord>): Promise<TripRecord> {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to save trip');
    return json.data;
  },

  async getTrips(userId?: string): Promise<TripRecord[]> {
    const url = userId ? `${API_BASE}/trips?userId=${userId}` : `${API_BASE}/trips`;
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch trips');
    return json.data || [];
  },

  async getTripById(id: string): Promise<TripRecord> {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Trip not found');
    return json.data;
  },

  async updateTrip(id: string, updates: Partial<TripRecord>): Promise<TripRecord> {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update trip');
    return json.data;
  },

  async deleteTrip(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/trips/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete trip');
    return json.success;
  },

  // Weather Endpoint
  async getWeather(destination: string, startDate?: string): Promise<WeatherData> {
    const params = new URLSearchParams({ destination });
    if (startDate) params.append('startDate', startDate);
    const res = await fetch(`${API_BASE}/weather?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch weather');
    return json.data;
  },
};

