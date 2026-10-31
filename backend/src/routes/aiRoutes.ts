import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/generate-itinerary', aiRateLimiter, AIController.generateItinerary);
router.post('/modify-itinerary', aiRateLimiter, AIController.modifyItinerary);
router.post('/optimize-budget', AIController.optimizeBudget);

export default router;

