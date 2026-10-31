import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weatherService';

export class WeatherController {
  public static async getWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const destination = (req.query.destination as string) || 'Manali';
      const startDate = req.query.startDate as string;

      const weather = await WeatherService.getWeatherForDestination(destination, startDate);
      res.status(200).json({
        success: true,
        data: weather,
      });
    } catch (err) {
      next(err);
    }
  }
}

