import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { TripRecord, Itinerary } from '../types';

export class SupabaseService {
  private static client: SupabaseClient | null = null;
  // In-memory fallback storage when Supabase is not yet configured
  private static mockTrips = new Map<string, TripRecord>();
  private static mockSavedPlaces = new Map<string, any[]>();

  public static initialize(): SupabaseClient | null {
    if (!this.client && config.supabaseUrl && (config.supabaseServiceRoleKey || config.supabaseAnonKey)) {
      try {
        const key = config.supabaseServiceRoleKey || config.supabaseAnonKey;
        this.client = createClient(config.supabaseUrl, key);
        console.log('[SupabaseService] Connected to Supabase project');
      } catch (err) {
        console.warn('[SupabaseService] Failed to initialize Supabase client, using in-memory store:', err);
        this.client = null;
      }
    }
    return this.client;
  }

  public static getClient(): SupabaseClient | null {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  // --- Trips Operations ---
  public static async createTrip(tripData: Omit<TripRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<TripRecord> {
    const client = this.getClient();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newTrip: TripRecord = {
      ...tripData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (client) {
      try {
        const { data, error } = await client
          .from('trips')
          .insert({
            id: newTrip.id,
            user_id: newTrip.userId || null,
            destination: newTrip.destination,
            starting_location: newTrip.startingLocation,
            start_date: newTrip.startDate,
            end_date: newTrip.endDate,
            travelers: newTrip.travelers,
            adults: newTrip.adults,
            children: newTrip.children,
            budget: newTrip.budget,
            budget_type: newTrip.budgetType,
            currency: newTrip.currency,
            travel_style: newTrip.travelStyle,
            travel_pace: newTrip.travelPace,
            interests: newTrip.interests,
            transportation: newTrip.transportation,
            accommodation: newTrip.accommodation,
            additional_preferences: newTrip.additionalPreferences,
            status: newTrip.status,
            cover_image: newTrip.coverImage,
          })
          .select()
          .single();

        if (error) throw error;

        // If itinerary exists, insert into itineraries table
        if (newTrip.itinerary) {
          await client.from('itineraries').insert({
            trip_id: newTrip.id,
            itinerary_json: newTrip.itinerary,
            total_estimated_budget: newTrip.itinerary.totalEstimatedBudget,
            currency: newTrip.itinerary.currency,
            version: newTrip.itinerary.version || 1,
          });
        }

        return newTrip;
      } catch (err) {
        console.warn('[SupabaseService] Supabase insert failed, falling back to local memory store:', err);
      }
    }

    // Local fallback
    this.mockTrips.set(id, newTrip);
    return newTrip;
  }

  public static async getTrips(userId?: string): Promise<TripRecord[]> {
    const client = this.getClient();

    if (client) {
      try {
        let query = client.from('trips').select('*, itineraries(*)').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (error) throw error;

        if (data) {
          return data.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            destination: item.destination,
            startingLocation: item.starting_location,
            startDate: item.start_date,
            endDate: item.end_date,
            travelers: item.travelers,
            adults: item.adults,
            children: item.children,
            budget: item.budget,
            budgetType: item.budget_type,
            currency: item.currency || 'INR',
            travelStyle: item.travel_style,
            travelPace: item.travel_pace,
            interests: item.interests || [],
            transportation: item.transportation,
            accommodation: item.accommodation,
            additionalPreferences: item.additional_preferences,
            status: item.status || 'planned',
            coverImage: item.cover_image,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            itinerary: item.itineraries?.[0]?.itinerary_json,
          }));
        }
      } catch (err) {
        console.warn('[SupabaseService] Supabase getTrips failed, falling back to local memory store:', err);
      }
    }

    const all = Array.from(this.mockTrips.values());
    if (userId) {
      return all.filter((t) => !t.userId || t.userId === userId);
    }
    return all;
  }

  public static async getTripById(id: string): Promise<TripRecord | null> {
    const client = this.getClient();

    if (client) {
      try {
        const { data, error } = await client
          .from('trips')
          .select('*, itineraries(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            userId: data.user_id,
            destination: data.destination,
            startingLocation: data.starting_location,
            startDate: data.start_date,
            endDate: data.end_date,
            travelers: data.travelers,
            adults: data.adults,
            children: data.children,
            budget: data.budget,
            budgetType: data.budget_type,
            currency: data.currency || 'INR',
            travelStyle: data.travel_style,
            travelPace: data.travel_pace,
            interests: data.interests || [],
            transportation: data.transportation,
            accommodation: data.accommodation,
            additionalPreferences: data.additional_preferences,
            status: data.status || 'planned',
            coverImage: data.cover_image,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            itinerary: data.itineraries?.[0]?.itinerary_json,
          };
        }
      } catch (err) {
        console.warn('[SupabaseService] Supabase getTripById failed, checking local store:', err);
      }
    }

    return this.mockTrips.get(id) || null;
  }

  public static async updateTrip(id: string, updates: Partial<TripRecord>): Promise<TripRecord | null> {
    const client = this.getClient();
    const existing = await this.getTripById(id);
    if (!existing) return null;

    const updated: TripRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (client) {
      try {
        await client.from('trips').update({
          destination: updated.destination,
          start_date: updated.startDate,
          end_date: updated.endDate,
          travelers: updated.travelers,
          budget: updated.budget,
          budget_type: updated.budgetType,
          status: updated.status,
          updated_at: updated.updatedAt,
        }).eq('id', id);

        if (updates.itinerary) {
          await client.from('itineraries').upsert({
            trip_id: id,
            itinerary_json: updates.itinerary,
            total_estimated_budget: updates.itinerary.totalEstimatedBudget,
            currency: updates.itinerary.currency,
            version: (existing.itinerary?.version || 1) + 1,
            updated_at: updated.updatedAt,
          });
        }
      } catch (err) {
        console.warn('[SupabaseService] Supabase updateTrip failed, updating local store:', err);
      }
    }

    this.mockTrips.set(id, updated);
    return updated;
  }

  public static async deleteTrip(id: string): Promise<boolean> {
    const client = this.getClient();

    if (client) {
      try {
        const { error } = await client.from('trips').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('[SupabaseService] Supabase deleteTrip failed, updating local store:', err);
      }
    }

    return this.mockTrips.delete(id);
  }
}

