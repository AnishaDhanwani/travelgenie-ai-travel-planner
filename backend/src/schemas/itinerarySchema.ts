import { z } from 'zod';

export const TripPreferencesSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  startingLocation: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
  travelers: z.number().int().min(1, 'At least 1 traveler required'),
  adults: z.number().int().min(1, 'At least 1 adult required'),
  children: z.number().int().min(0).default(0),
  budget: z.number().positive('Budget must be greater than 0'),
  budgetType: z.enum(['per_person', 'total_group']).default('per_person'),
  budgetCategory: z.enum(['Budget', 'Moderate', 'Luxury']).default('Moderate'),
  currency: z.string().default('INR'),
  travelStyle: z.enum(['solo', 'couple', 'family', 'friends']),
  travelPace: z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  transportation: z.string().min(1, 'Transportation preference is required'),
  accommodation: z.string().min(1, 'Accommodation preference is required'),
  additionalRequirements: z.string().optional(),
});

export const ActivitySchema = z.object({
  time: z.string(),
  period: z.enum(['Morning', 'Afternoon', 'Evening']),
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['Sightseeing', 'Adventure', 'Food', 'Culture', 'Relaxation', 'Shopping', 'Nature']).catch('Sightseeing'),
  estimatedCost: z.number().min(0),
  duration: z.string(),
  location: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  travelTimeFromPrevious: z.string().default('15 minutes'),
  transportSuggestion: z.string().default('Local transport'),
  isVerifiedPlace: z.boolean().optional(),
});

export const FoodRecommendationSchema = z.object({
  meal: z.enum(['Breakfast', 'Lunch', 'Dinner']),
  restaurantName: z.string(),
  cuisine: z.string(),
  approxCost: z.number().min(0),
  specialty: z.string(),
  location: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export const DayItinerarySchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  date: z.string(),
  activities: z.array(ActivitySchema),
  estimatedDailyBudget: z.number().min(0),
  foodRecommendations: z.array(FoodRecommendationSchema).default([]),
  travelTips: z.array(z.string()).default([]),
});

export const BudgetBreakdownSchema = z.object({
  transportation: z.number().min(0),
  accommodation: z.number().min(0),
  food: z.number().min(0),
  activities: z.number().min(0),
  miscellaneous: z.number().min(0),
});

export const ItinerarySchema = z.object({
  tripTitle: z.string(),
  destination: z.string(),
  summary: z.string(),
  totalEstimatedBudget: z.number().positive(),
  currency: z.string().default('INR'),
  budgetType: z.enum(['per_person', 'total_group']).optional(),
  budgetCategory: z.enum(['Budget', 'Moderate', 'Luxury']).optional(),
  travelStyle: z.enum(['solo', 'couple', 'family', 'friends']).optional(),
  travelPace: z.enum(['relaxed', 'balanced', 'packed']).optional(),
  days: z.array(DayItinerarySchema).min(1),
  budgetBreakdown: BudgetBreakdownSchema,
  travelTips: z.array(z.string()).default([]),
  packingSuggestions: z.array(z.string()).default([]),
  version: z.number().optional(),
  id: z.string().optional(),
  tripId: z.string().optional(),
  createdAt: z.string().optional(),
});

export const ModifyItineraryRequestSchema = z.object({
  existingItinerary: ItinerarySchema,
  modificationPrompt: z.string().min(3, 'Modification instruction must be at least 3 characters'),
  userBudget: z.number().positive().optional(),
});

export const OptimizeBudgetRequestSchema = z.object({
  itinerary: ItinerarySchema,
  targetBudget: z.number().positive(),
  travelers: z.number().positive().default(1),
});

