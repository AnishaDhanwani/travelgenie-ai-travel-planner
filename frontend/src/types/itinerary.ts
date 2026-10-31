export type BudgetCategory = 'Budget' | 'Moderate' | 'Luxury';
export type BudgetType = 'per_person' | 'total_group';
export type TravelPace = 'relaxed' | 'balanced' | 'packed';
export type TravelStyle = 'solo' | 'couple' | 'family' | 'friends';

export interface TripPreferences {
  destination: string;
  startingLocation?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  adults: number;
  children: number;
  budget: number;
  budgetType: BudgetType;
  budgetCategory: BudgetCategory;
  currency: string;
  travelStyle: TravelStyle;
  travelPace: TravelPace;
  interests: string[];
  transportation: string;
  accommodation: string;
  additionalRequirements?: string;
}

export interface Activity {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  name: string;
  description: string;
  category: 'Sightseeing' | 'Adventure' | 'Food' | 'Culture' | 'Relaxation' | 'Shopping' | 'Nature';
  estimatedCost: number;
  duration: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  travelTimeFromPrevious: string;
  transportSuggestion: string;
  isVerifiedPlace?: boolean;
}

export interface FoodRecommendation {
  meal: 'Breakfast' | 'Lunch' | 'Dinner';
  restaurantName: string;
  cuisine: string;
  approxCost: number;
  specialty: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DayItinerary {
  day: number;
  title: string;
  date: string;
  activities: Activity[];
  estimatedDailyBudget: number;
  foodRecommendations: FoodRecommendation[];
  travelTips: string[];
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
}

export interface Itinerary {
  id?: string;
  tripId?: string;
  tripTitle: string;
  destination: string;
  summary: string;
  totalEstimatedBudget: number;
  currency: string;
  budgetType?: BudgetType;
  budgetCategory?: BudgetCategory;
  travelStyle?: TravelStyle;
  travelPace?: TravelPace;
  days: DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
  travelTips: string[];
  packingSuggestions: string[];
  version?: number;
  createdAt?: string;
}

export interface TripRecord {
  id: string;
  userId?: string;
  destination: string;
  startingLocation?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  adults: number;
  children: number;
  budget: number;
  budgetType: BudgetType;
  currency: string;
  travelStyle: string;
  travelPace: string;
  interests: string[];
  transportation: string;
  accommodation: string;
  additionalPreferences?: string;
  status: 'draft' | 'planned' | 'completed' | 'archived';
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  itinerary?: Itinerary;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainProbability?: number;
  isForecastAvailable: boolean;
  seasonalAdvisory: string;
  forecast?: {
    date: string;
    tempDay: number;
    tempNight: number;
    condition: string;
    icon: string;
  }[];
}

export interface BudgetOptimizationSuggestion {
  id: string;
  category: 'Transportation' | 'Accommodation' | 'Activities' | 'Food';
  title: string;
  description: string;
  potentialSavings: number;
  actionType: 'replace_activity' | 'change_transport' | 'change_stay' | 'free_alternative';
  targetActivityIndex?: { dayIndex: number; activityIndex: number };
  replacementActivity?: Partial<Activity>;
}

