import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../services/supabaseService';

export class TripController {
  public static async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripData = req.body;
      const created = await SupabaseService.createTrip(tripData);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Trip saved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.query.userId as string) || (req as any).user?.id;
      const trips = await SupabaseService.getTrips(userId);
      res.status(200).json({
        success: true,
        data: trips,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTripById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await SupabaseService.getTripById(id);
      if (!trip) {
        res.status(404).json({
          success: false,
          message: 'Trip not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await SupabaseService.updateTrip(id, req.body);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Trip not found or update failed',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Trip updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await SupabaseService.deleteTrip(id);
      res.status(200).json({
        success: deleted,
        message: deleted ? 'Trip deleted successfully' : 'Trip not found',
      });
    } catch (err) {
      next(err);
    }
  }
}

