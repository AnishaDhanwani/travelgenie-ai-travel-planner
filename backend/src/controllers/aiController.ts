import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/geminiService';
import { BudgetService } from '../services/budgetService';
import { TripPreferencesSchema, ModifyItineraryRequestSchema, OptimizeBudgetRequestSchema } from '../schemas/itinerarySchema';

export class AIController {
  public static async generateItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = TripPreferencesSchema.parse(req.body);
      const itinerary = await GeminiService.generateItinerary(validatedInput);

      res.status(200).json({
        success: true,
        data: itinerary,
        message: 'Itinerary generated successfully',
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async modifyItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { existingItinerary, modificationPrompt, userBudget } = ModifyItineraryRequestSchema.parse(req.body);
      const modified = await GeminiService.modifyItinerary(existingItinerary, modificationPrompt, userBudget);

      res.status(200).json({
        success: true,
        data: modified,
        message: 'Itinerary modified successfully',
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async optimizeBudget(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { itinerary, targetBudget, travelers } = OptimizeBudgetRequestSchema.parse(req.body);
      const analysis = BudgetService.analyzeBudget(
        itinerary,
        targetBudget,
        travelers,
        itinerary.budgetType || 'per_person'
      );

      res.status(200).json({
        success: true,
        data: analysis,
        message: 'Budget analyzed and optimization recommendations generated',
      });
    } catch (err: any) {
      next(err);
    }
  }
}

