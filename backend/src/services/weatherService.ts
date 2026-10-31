import { config } from '../config/env';
import { WeatherData } from '../types';
import { GeocodingService } from './geocodingService';

export class WeatherService {
  public static async getWeatherForDestination(destination: string, startDate?: string): Promise<WeatherData> {
    const coords = await GeocodingService.getDestinationCoords(destination) || { lat: 28.6139, lon: 77.2090 };
    
    // Check if OpenWeather API key is configured
    if (config.openWeatherApiKey) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${config.openWeatherApiKey}&units=metric`;
        const res = await fetch(url);
        if (res.ok) {
          const data = (await res.json()) as any;
          const current = data.list[0];

          // Group by day for forecast
          const dailyMap = new Map<string, any>();
          for (const item of data.list) {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyMap.has(date) && dailyMap.size < 5) {
              dailyMap.set(date, {
                date,
                tempDay: Math.round(item.main.temp_max),
                tempNight: Math.round(item.main.temp_min),
                condition: item.weather[0]?.main || 'Clear',
                icon: item.weather[0]?.icon || '01d',
              });
            }
          }

          return {
            city: data.city?.name || destination,
            temperature: Math.round(current.main.temp),
            feelsLike: Math.round(current.main.feels_like),
            condition: current.weather[0]?.main || 'Clear',
            description: current.weather[0]?.description || 'clear sky',
            icon: current.weather[0]?.icon || '01d',
            humidity: current.main.humidity,
            windSpeed: current.wind.speed,
            rainProbability: current.pop ? Math.round(current.pop * 100) : 0,
            isForecastAvailable: true,
            seasonalAdvisory: this.getSeasonalAdvisory(destination, startDate),
            forecast: Array.from(dailyMap.values()),
          };
        }
      } catch {
        // Fallback to estimated climate
      }
    }

    // High quality climate advisory fallback when API key is missing or dates are in the future
    return this.generateClimateAdvisory(destination, startDate);
  }

  private static generateClimateAdvisory(destination: string, startDate?: string): WeatherData {
    const destLower = destination.toLowerCase();
    const month = startDate ? new Date(startDate).getMonth() + 1 : new Date().getMonth() + 1;
    const isWinter = month === 12 || month === 1 || month === 2;
    const isSummer = month >= 4 && month <= 6;
    const isMonsoon = month >= 7 && month <= 9;

    let temp = 22;
    let condition = 'Pleasant';
    let description = 'Moderate, comfortable travel conditions';
    let icon = '02d';
    let rainProb = 10;
    let humidity = 55;
    let advisory = 'Great time to travel! Pack comfortable casual layers.';

    if (destLower.includes('manali') || destLower.includes('shimla') || destLower.includes('kashmir')) {
      if (isWinter) {
        temp = 2;
        condition = 'Snowy / Chilly';
        description = 'Sub-zero mornings with potential snowfall and clear alpine skies';
        icon = '13d';
        rainProb = 35;
        humidity = 70;
        advisory = 'Heavy woolens, thermal innerwear, snow boots, and windproof jackets required.';
      } else if (isMonsoon) {
        temp = 18;
        condition = 'Rainy';
        description = 'Hilly rains with mist and lush green views';
        icon = '10d';
        rainProb = 65;
        advisory = 'Check mountain road advisories, carry raincoats and waterproof footwear.';
      } else {
        temp = 19;
        condition = 'Sunny';
        description = 'Crisp mountain air, ideal for hiking and sightseeing';
        icon = '01d';
        advisory = 'Light jackets for mornings and evenings; sunglasses and sunscreen for daytime.';
      }
    } else if (destLower.includes('goa') || destLower.includes('kerala')) {
      if (isMonsoon) {
        temp = 27;
        condition = 'Tropical Showers';
        description = 'Lush monsoon ambiance, occasional heavy showers';
        icon = '10d';
        rainProb = 70;
        humidity = 85;
        advisory = 'Scenic monsoon season; carry quick-drying clothes and waterproof bags.';
      } else {
        temp = 29;
        condition = 'Warm & Sunny';
        description = 'Golden sunshine, ocean breeze, perfect beach weather';
        icon = '01d';
        rainProb = 5;
        humidity = 65;
        advisory = 'Breathable cottons, swimwear, sunglasses, and high-SPF sunscreen.';
      }
    } else if (destLower.includes('jaipur') || destLower.includes('rajasthan')) {
      if (isWinter) {
        temp = 16;
        condition = 'Mild & Sunny';
        description = 'Chilly evenings and warm heritage sunny afternoons';
        icon = '01d';
        advisory = 'Peak season! Light woolens for night walking, light cottons for day.';
      } else if (isSummer) {
        temp = 38;
        condition = 'Hot';
        description = 'High daytime temperatures with low humidity';
        icon = '01d';
        advisory = 'Stay hydrated, schedule outdoor palace visits before 11 AM or after 4 PM.';
      }
    }

    const forecast = [];
    const baseDate = startDate ? new Date(startDate) : new Date();
    for (let i = 0; i < 5; i++) {
      const fDate = new Date(baseDate);
      fDate.setDate(baseDate.getDate() + i);
      forecast.push({
        date: fDate.toISOString().split('T')[0],
        tempDay: temp + Math.round((Math.sin(i) * 2)),
        tempNight: temp - 6 + Math.round((Math.cos(i) * 2)),
        condition,
        icon,
      });
    }

    return {
      city: destination,
      temperature: temp,
      feelsLike: temp + (humidity > 70 ? 2 : -1),
      condition,
      description,
      icon,
      humidity,
      windSpeed: 4.2,
      rainProbability: rainProb,
      isForecastAvailable: false, // Label clearly that this is an estimated climate advisory
      seasonalAdvisory: advisory,
      forecast,
    };
  }

  private static getSeasonalAdvisory(destination: string, startDate?: string): string {
    const month = startDate ? new Date(startDate).getMonth() + 1 : new Date().getMonth() + 1;
    if (month >= 11 || month <= 2) {
      return 'Winter period: Cooler nights, moderate days. Layering recommended.';
    }
    if (month >= 3 && month <= 6) {
      return 'Spring/Summer period: Ample daylight. Sun protection and hydration recommended.';
    }
    return 'Monsoon/Post-Monsoon period: Check local weather forecasts and carry rain gear.';
  }
}

