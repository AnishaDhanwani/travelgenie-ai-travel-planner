import { Request, Response, NextFunction } from 'express';
import { GeocodingService } from '../services/geocodingService';

export class PlacesController {
  public static async geocode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const place = (req.query.place as string) || '';
      const destination = (req.query.destination as string) || '';

      if (!place && !destination) {
        res.status(400).json({
          success: false,
          message: 'place or destination query parameter is required',
        });
        return;
      }

      const coords = place
        ? await GeocodingService.geocodePlace(place, destination)
        : await GeocodingService.getDestinationCoords(destination);

      res.status(200).json({
        success: true,
        data: coords,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async searchPlaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const destination = (req.query.destination as string) || '';
      const coords = await GeocodingService.getDestinationCoords(destination);

      res.status(200).json({
        success: true,
        data: {
          destination,
          coordinates: coords,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

