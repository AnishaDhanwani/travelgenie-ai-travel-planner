import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';
import { Itinerary, TripPreferences } from '../types';
import { ItinerarySchema } from '../schemas/itinerarySchema';
import { GeocodingService } from './geocodingService';

export class GeminiService {
  private static aiClient: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!this.aiClient && config.geminiApiKey) {
      try {
        this.aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (err) {
        console.warn('[GeminiService] Failed to initialize GoogleGenAI client:', err);
      }
    }
    return this.aiClient;
  }

  /**
   * Generate complete structured travel itinerary
   */
  public static async generateItinerary(prefs: TripPreferences): Promise<Itinerary> {
    const durationDays = this.calculateDays(prefs.startDate, prefs.endDate);
    const client = this.getClient();

    if (client) {
      const prompt = this.buildGenerationPrompt(prefs, durationDays);

      // Attempt AI generation with retry
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.4,
            },
          });

          const rawText = response.text?.trim() || '';
          const parsed = JSON.parse(rawText);
          const validated = ItinerarySchema.parse(parsed);

          // Geocode activities to attach verified real coordinates for Leaflet
          await this.enrichCoordinates(validated, prefs.destination);
          return validated;
        } catch (err: any) {
          console.warn(`[GeminiService] Attempt ${attempt} failed:`, err?.message || err);
          if (attempt === 2) {
            console.warn('[GeminiService] AI generation failed, falling back to intelligent template engine.');
          }
        }
      }
    }

    // High quality intelligent generator fallback
    const fallbackItinerary = this.generateIntelligentFallback(prefs, durationDays);
    await this.enrichCoordinates(fallbackItinerary, prefs.destination);
    return fallbackItinerary;
  }

  /**
   * Modify existing itinerary using natural language instructions
   */
  public static async modifyItinerary(
    existing: Itinerary,
    instruction: string,
    userBudget?: number
  ): Promise<Itinerary> {
    const client = this.getClient();

    if (client) {
      const prompt = `You are TravelGenie's Senior AI Travel Architect.
A traveler wants to modify their existing travel itinerary based on this natural language request:
"${instruction}"

User's Budget: ${userBudget || existing.totalEstimatedBudget} ${existing.currency}

EXISTING ITINERARY JSON:
${JSON.stringify(existing, null, 2)}

INSTRUCTIONS:
1. Update ONLY the necessary activities, food recommendations, or budget breakdown based on the traveler's request.
2. Preserve all untouched days, activities, and timings.
3. If requested to make cheaper, lower activity costs, suggest free nature walks/viewpoints, and adjust the total budget downward.
4. If requested to add photography, vegetarian food, or relaxed pace, update corresponding activity names, descriptions, and meal suggestions.
5. Return ONLY a single valid JSON object following the EXACT schema of the existing itinerary. Do not include markdown codeblocks or extra text.`;

      try {
        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);
        const validated = ItinerarySchema.parse(parsed);
        await this.enrichCoordinates(validated, existing.destination);
        validated.version = (existing.version || 1) + 1;
        return validated;
      } catch (err) {
        console.warn('[GeminiService] AI modification failed, applying heuristic modification:', err);
      }
    }

    // Heuristic modification fallback
    return this.applyHeuristicModification(existing, instruction, userBudget);
  }

  private static buildGenerationPrompt(prefs: TripPreferences, days: number): string {
    const effectiveBudget = prefs.budgetType === 'per_person' ? prefs.budget * prefs.travelers : prefs.budget;

    return `You are TravelGenie, an expert AI travel planner and tour architect.
Generate a comprehensive, realistic ${days}-day itinerary for a trip to "${prefs.destination}".

TRIP SPECIFICATIONS:
- Destination: ${prefs.destination}
- Starting Location: ${prefs.startingLocation || 'Not specified'}
- Start Date: ${prefs.startDate}
- End Date: ${prefs.endDate} (${days} days total)
- Travelers: ${prefs.travelers} (${prefs.adults} adults, ${prefs.children} children)
- Total Budget for Trip: ${effectiveBudget} ${prefs.currency}
- Budget Category: ${prefs.budgetCategory}
- Travel Style: ${prefs.travelStyle}
- Travel Pace: ${prefs.travelPace}
- Selected Interests: ${prefs.interests.join(', ')}
- Preferred Transportation: ${prefs.transportation}
- Accommodation Preference: ${prefs.accommodation}
- Additional Requirements: "${prefs.additionalRequirements || 'None'}"

CRITICAL PLANNING RULES:
1. Respect the total budget of ${effectiveBudget} ${prefs.currency}. Ensure sum of budgetBreakdown equals totalEstimatedBudget.
2. Group attractions that are geographically close together on the same day. Realistic travel times between stops.
3. Schedule 3 primary activities per day: Morning, Afternoon, Evening (adjusted to "${prefs.travelPace}" pace).
4. Include authentic restaurant recommendations for Lunch and Dinner each day reflecting local cuisine and user requirements.
5. Provide realistic estimated ticket/entry fees for activities.
6. Clearly mark that prices and travel times are estimated planning figures, not confirmed bookings.

OUTPUT JSON FORMAT (Follow this schema strictly):
{
  "tripTitle": "${days} Days in ${prefs.destination}",
  "destination": "${prefs.destination}",
  "summary": "Concise 2-sentence summary highlighting trip theme and style",
  "totalEstimatedBudget": ${effectiveBudget},
  "currency": "${prefs.currency}",
  "budgetType": "${prefs.budgetType}",
  "budgetCategory": "${prefs.budgetCategory}",
  "travelStyle": "${prefs.travelStyle}",
  "travelPace": "${prefs.travelPace}",
  "days": [
    {
      "day": 1,
      "title": "Day theme (e.g. Arrival & Heritage Highlights)",
      "date": "${prefs.startDate}",
      "activities": [
        {
          "time": "09:30 AM",
          "period": "Morning",
          "name": "Attraction Name",
          "description": "Engaging description with practical tips",
          "category": "Sightseeing",
          "estimatedCost": 250,
          "duration": "2 hours",
          "location": "Specific neighborhood or landmark area in ${prefs.destination}",
          "travelTimeFromPrevious": "20 mins",
          "transportSuggestion": "Metro / Taxi"
        }
      ],
      "estimatedDailyBudget": 2500,
      "foodRecommendations": [
        {
          "meal": "Lunch",
          "restaurantName": "Authentic Restaurant Name",
          "cuisine": "Regional Cuisine",
          "approxCost": 600,
          "specialty": "Signature dish to try",
          "location": "Area"
        }
      ],
      "travelTips": ["Daily localized tip"]
    }
  ],
  "budgetBreakdown": {
    "transportation": ${Math.round(effectiveBudget * 0.25)},
    "accommodation": ${Math.round(effectiveBudget * 0.35)},
    "food": ${Math.round(effectiveBudget * 0.20)},
    "activities": ${Math.round(effectiveBudget * 0.15)},
    "miscellaneous": ${Math.round(effectiveBudget * 0.05)}
  },
  "travelTips": ["Practical destination tip 1", "Practical tip 2"],
  "packingSuggestions": ["Clothing recommendation", "Gear or essentials recommendation"]
}`;
  }

  /**
   * Geocode all places in the itinerary so the Leaflet map has real coordinates
   */
  private static async enrichCoordinates(itinerary: Itinerary, destination: string): Promise<void> {
    for (const day of itinerary.days) {
      for (const act of day.activities) {
        if (!act.latitude || !act.longitude) {
          const coords = await GeocodingService.geocodePlace(act.name, destination);
          if (coords) {
            act.latitude = coords.lat;
            act.longitude = coords.lon;
            act.isVerifiedPlace = true;
          }
        }
      }
      for (const food of day.foodRecommendations) {
        if (!food.latitude || !food.longitude) {
          const coords = await GeocodingService.geocodePlace(food.restaurantName, destination);
          if (coords) {
            food.latitude = coords.lat;
            food.longitude = coords.lon;
          }
        }
      }
    }
  }

  /**
   * Intelligent deterministic fallback generator for when Gemini API key is missing
   */
  private static generateIntelligentFallback(prefs: TripPreferences, days: number): Itinerary {
    const effectiveBudget = prefs.budgetType === 'per_person' ? prefs.budget * prefs.travelers : prefs.budget;
    const dest = prefs.destination;
    const destLower = dest.toLowerCase();

    // Destination-specific curated attractions database
    let spotPool: { name: string; desc: string; cat: any; cost: number; loc: string }[] = [];
    let foodPool: { name: string; cuisine: string; cost: number; spec: string }[] = [];

    if (destLower.includes('manali')) {
      spotPool = [
        { name: 'Hadimba Devi Temple', desc: 'Ancient cedar-shrouded wooden temple built in 1553.', cat: 'Culture', cost: 50, loc: 'Dhungri Forest' },
        { name: 'Solang Valley Adventure Arena', desc: 'Breathtaking valley known for paragliding, zorbing, and mountain views.', cat: 'Adventure', cost: 1500, loc: 'Solang' },
        { name: 'Old Manali Bohemian Lane', desc: 'Charming stone-and-wood lanes with cozy cafes, live music, and apple orchards.', cat: 'Relaxation', cost: 200, loc: 'Old Manali' },
        { name: 'Vashisht Hot Water Springs & Temple', desc: 'Natural sulfur thermal baths and ancient stone temple.', cat: 'Relaxation', cost: 0, loc: 'Vashisht Village' },
        { name: 'Jogini Waterfall Trek', desc: 'Scenic trek passing through pine woods to cascading fresh mountain falls.', cat: 'Nature', cost: 0, loc: 'Near Vashisht' },
        { name: 'Atal Tunnel & Sissu Falls', desc: 'Engineering marvel leading into the dramatic Lahaul Valley and alpine waterfalls.', cat: 'Sightseeing', cost: 600, loc: 'Lahaul Highway' },
        { name: 'Mall Road & Tibetan Monastery', desc: 'Strolling through local artisanal woolens, saffron shops, and colorful prayer wheels.', cat: 'Shopping', cost: 300, loc: 'Manali Center' },
        { name: 'Naggar Castle & Roerich Art Gallery', desc: 'Historic wooden castle overlooking the Beas River and famous Himalayan art.', cat: 'Culture', cost: 100, loc: 'Naggar' },
      ];
      foodPool = [
        { name: 'Cafe 1947', cuisine: 'Italian & Himalayan', cost: 700, spec: 'Trout Fish & Wood-fired Pizza by the river' },
        { name: 'Drifters Inn & Cafe', cuisine: 'Continental & Indian', cost: 500, spec: 'Hot Chocolate & Shakshuka' },
        { name: 'The Johnson’s Cafe', cuisine: 'European & Continental', cost: 800, spec: 'Fresh Baked Trout with Almond butter' },
        { name: 'Lazy Dog Lounge', cuisine: 'Multi-Cuisine', cost: 600, spec: 'Mountain herbs pasta & Korean momos' },
        { name: 'Chopsticks Restaurant', cuisine: 'Tibetan & Chinese', cost: 400, spec: 'Steamed Thukpa & Tingmo' },
      ];
    } else if (destLower.includes('goa')) {
      spotPool = [
        { name: 'Fort Aguada & Lighthouse', desc: '17th-century Portuguese fort guarding the Arabian Sea.', cat: 'Culture', cost: 50, loc: 'Sinquerim' },
        { name: 'Anjuna Flea Market & Beach', desc: 'Famous bohemian beach with vibrant sunsets and artisan stalls.', cat: 'Shopping', cost: 100, loc: 'North Goa' },
        { name: 'Basilica of Bom Jesus', desc: 'UNESCO World Heritage baroque church in Old Goa.', cat: 'Culture', cost: 0, loc: 'Old Goa' },
        { name: 'Palolem Beach Kayaking', desc: 'Crescent-shaped serene beach with peaceful turquoise waters.', cat: 'Adventure', cost: 500, loc: 'South Goa' },
        { name: 'Dudhsagar Waterfalls Safari', desc: 'Four-tiered sea of milk waterfall deep within Bhagwan Mahaveer Sanctuary.', cat: 'Nature', cost: 1200, loc: 'Sonaulim' },
        { name: 'Fontainhas Latin Quarter Walk', desc: 'Vibrant Portuguese heritage quarter with colorful colonial architecture.', cat: 'Culture', cost: 0, loc: 'Panaji' },
      ];
      foodPool = [
        { name: 'Fisherman’s Wharf', cuisine: 'Goan Seafood', cost: 850, spec: 'Goan Fish Curry Thali & Prawn Balchão' },
        { name: 'Vinayak Family Restaurant', cuisine: 'Local Coastal', cost: 400, spec: 'Authentic Kingfish Fry Thali' },
        { name: 'Gunpowder', cuisine: 'South Indian Coastal', cost: 750, spec: 'Appam with Kerela Mutton Curry' },
        { name: 'Curlies Beach Shack', cuisine: 'Beachside Bites', cost: 500, spec: 'Woodfired Pizza & Fresh Coconut Water' },
      ];
    } else if (destLower.includes('jaipur')) {
      spotPool = [
        { name: 'Amber Fort & Palace', desc: 'Majestic hilltop sandstone fortress with mirror palace and elephant paths.', cat: 'Culture', cost: 200, loc: 'Amer' },
        { name: 'Hawa Mahal (Palace of Winds)', desc: 'Iconic 5-story pink honeycomb facade built for royal women.', cat: 'Sightseeing', cost: 50, loc: 'Badi Choupad' },
        { name: 'City Palace & Jantar Mantar', desc: 'Royal residence museum and UNESCO astronomical observatory.', cat: 'Culture', cost: 300, loc: 'Old City' },
        { name: 'Nahargarh Fort Sunset Point', desc: 'Panoramic hilltop fortress overlooking the sparkling Pink City.', cat: 'Nature', cost: 100, loc: 'Aravalli Hills' },
        { name: 'Johari Bazaar & Bapu Bazaar', desc: 'Traditional market famous for gemstones, bandhani textiles, and mojris.', cat: 'Shopping', cost: 200, loc: 'Pink City' },
      ];
      foodPool = [
        { name: 'Laxmi Mishthan Bhandar (LMB)', cuisine: 'Rajasthani Vegetarian', cost: 450, spec: 'Dal Baati Churma & Ghewar' },
        { name: 'Bar Palladio', cuisine: 'Italian & Cocktails', cost: 950, spec: 'Handmade Pasta in royal cobalt decor' },
        { name: 'Rawat Mishthan Bhandar', cuisine: 'Street Savories', cost: 200, spec: 'Crispy Pyaaz Kachori with Mint Chutney' },
      ];
    } else {
      // Universal Travel Template
      spotPool = [
        { name: `${dest} Historic Old Quarter`, desc: 'Explore historic alleys, vibrant squares, and traditional architecture.', cat: 'Culture', cost: 100, loc: dest },
        { name: `${dest} Central Botanic Gardens & Vista`, desc: 'Peaceful landscaped grounds with native flora and scenic panoramas.', cat: 'Nature', cost: 50, loc: dest },
        { name: `${dest} Cultural Arts & Heritage Museum`, desc: 'Rich repository of regional history, arts, and curated exhibits.', cat: 'Culture', cost: 150, loc: dest },
        { name: `${dest} Artisan Craft & Market Bazaar`, desc: 'Lively bustling stalls with handmade souvenirs, spices, and clothing.', cat: 'Shopping', cost: 200, loc: dest },
        { name: `${dest} Sunset Scenic Viewpoint`, desc: 'Spectacular observation point ideal for photography as the sun sets.', cat: 'Sightseeing', cost: 0, loc: dest },
      ];
      foodPool = [
        { name: `The Heritage Kitchen at ${dest}`, cuisine: 'Authentic Local', cost: 500, spec: 'Traditional Chef Tasting Platter' },
        { name: `Boutique Bistro & Cafe`, cuisine: 'Fusion & Continental', cost: 650, spec: 'Artisan Coffee & Gourmet Flatbreads' },
      ];
    }

    const dayList = [];
    const dailyBudget = Math.round(effectiveBudget / Math.max(1, days));
    const baseDate = new Date(prefs.startDate);

    for (let d = 1; d <= days; d++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + (d - 1));
      const dateStr = currentDate.toISOString().split('T')[0];

      const s1 = spotPool[(d * 3 - 3) % spotPool.length];
      const s2 = spotPool[(d * 3 - 2) % spotPool.length];
      const s3 = spotPool[(d * 3 - 1) % spotPool.length];

      const f1 = foodPool[(d * 2 - 2) % foodPool.length];
      const f2 = foodPool[(d * 2 - 1) % foodPool.length];

      dayList.push({
        day: d,
        title: d === 1 ? 'Arrival & Neighborhood Discovery' : d === days ? 'Final Sightseeing & Souvenirs' : `Exploring the Wonders of ${dest}`,
        date: dateStr,
        activities: [
          {
            time: '09:30 AM',
            period: 'Morning' as const,
            name: s1.name,
            description: s1.desc,
            category: s1.cat,
            estimatedCost: s1.cost,
            duration: '2 hours',
            location: s1.loc,
            latitude: null,
            longitude: null,
            travelTimeFromPrevious: '20 mins',
            transportSuggestion: prefs.transportation || 'Local Taxi / Walking',
          },
          {
            time: '02:00 PM',
            period: 'Afternoon' as const,
            name: s2.name,
            description: s2.desc,
            category: s2.cat,
            estimatedCost: s2.cost,
            duration: '2.5 hours',
            location: s2.loc,
            latitude: null,
            longitude: null,
            travelTimeFromPrevious: '25 mins',
            transportSuggestion: 'Public Shuttle / Cab',
          },
          {
            time: '06:00 PM',
            period: 'Evening' as const,
            name: s3.name,
            description: s3.desc,
            category: s3.cat,
            estimatedCost: s3.cost,
            duration: '2 hours',
            location: s3.loc,
            latitude: null,
            longitude: null,
            travelTimeFromPrevious: '15 mins',
            transportSuggestion: 'Walking / Rickshaw',
          },
        ],
        estimatedDailyBudget: dailyBudget,
        foodRecommendations: [
          {
            meal: 'Lunch' as const,
            restaurantName: f1.name,
            cuisine: f1.cuisine,
            approxCost: f1.cost,
            specialty: f1.spec,
            location: dest,
          },
          {
            meal: 'Dinner' as const,
            restaurantName: f2.name,
            cuisine: f2.cuisine,
            approxCost: f2.cost,
            specialty: f2.spec,
            location: dest,
          },
        ],
        travelTips: [
          `Carry small change for local transport and market stalls.`,
          `Keep bottled water and camera batteries charged for the afternoon.`,
        ],
      });
    }

    const transportBudget = Math.round(effectiveBudget * 0.22);
    const stayBudget = Math.round(effectiveBudget * 0.38);
    const foodBudget = Math.round(effectiveBudget * 0.20);
    const actBudget = Math.round(effectiveBudget * 0.15);
    const miscBudget = effectiveBudget - (transportBudget + stayBudget + foodBudget + actBudget);

    return {
      tripTitle: `${days} Days in ${dest}`,
      destination: dest,
      summary: `A carefully balanced ${days}-day ${prefs.travelStyle} exploration of ${dest} featuring top attractions, scenic nature, and local dining tailored for a ${prefs.travelPace} pace.`,
      totalEstimatedBudget: effectiveBudget,
      currency: prefs.currency || 'INR',
      budgetType: prefs.budgetType,
      budgetCategory: prefs.budgetCategory,
      travelStyle: prefs.travelStyle,
      travelPace: prefs.travelPace,
      days: dayList,
      budgetBreakdown: {
        transportation: transportBudget,
        accommodation: stayBudget,
        food: foodBudget,
        activities: actBudget,
        miscellaneous: Math.max(0, miscBudget),
      },
      travelTips: [
        `Book popular attraction tickets early to skip ticket queues.`,
        `Respect local customs and check photography guidelines before shooting inside sacred sites.`,
        `Always keep offline maps downloaded on your phone.`,
      ],
      packingSuggestions: [
        `Comfortable walking shoes suitable for exploring terrains.`,
        `Power bank, universal adapter, and memory cards.`,
        `Light jacket or shawl for evenings and air-conditioned transit.`,
      ],
      version: 1,
    };
  }

  private static applyHeuristicModification(
    existing: Itinerary,
    instruction: string,
    userBudget?: number
  ): Itinerary {
    const updated = JSON.parse(JSON.stringify(existing)) as Itinerary;
    const lower = instruction.toLowerCase();

    if (lower.includes('cheaper') || lower.includes('reduce budget') || lower.includes('less expensive')) {
      updated.totalEstimatedBudget = Math.round(updated.totalEstimatedBudget * 0.85);
      updated.budgetBreakdown.transportation = Math.round(updated.budgetBreakdown.transportation * 0.85);
      updated.budgetBreakdown.accommodation = Math.round(updated.budgetBreakdown.accommodation * 0.85);
      updated.budgetBreakdown.activities = Math.round(updated.budgetBreakdown.activities * 0.8);
      updated.days.forEach((day) => {
        day.activities.forEach((act) => {
          if (act.estimatedCost > 200) {
            act.estimatedCost = Math.round(act.estimatedCost * 0.6);
          }
        });
      });
      updated.summary += ` (Optimized for reduced expenditure)`;
    } else if (lower.includes('vegetarian') || lower.includes('veg')) {
      updated.days.forEach((day) => {
        day.foodRecommendations.forEach((f) => {
          f.cuisine = `Pure Vegetarian ${f.cuisine}`;
          f.specialty = `Organic Vegetarian Thali & Seasonal specialties`;
        });
      });
      updated.summary += ` (Focused on verified vegetarian cuisine)`;
    } else if (lower.includes('photography') || lower.includes('photo')) {
      if (updated.days[0]?.activities[0]) {
        updated.days[0].activities[0].name += ' (Golden Hour Photography Spot)';
        updated.days[0].activities[0].description += ' Renowned among landscape photographers for clear vistas and lighting.';
      }
    } else if (lower.includes('relaxed') || lower.includes('relax')) {
      updated.travelPace = 'relaxed';
      updated.days.forEach((day) => {
        if (day.activities.length > 2) {
          day.activities[2].name = `Relaxed Leisure & Sunset Stroll`;
          day.activities[2].description = `Unwind at a scenic cafe, enjoy tea by the promenade, or rest at your accommodation.`;
          day.activities[2].category = 'Relaxation';
        }
      });
    }

    if (userBudget && userBudget > 0) {
      updated.totalEstimatedBudget = userBudget;
    }

    updated.version = (existing.version || 1) + 1;
    return updated;
  }

  private static calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diff, 14)); // cap between 1 and 14 days
  }
}

