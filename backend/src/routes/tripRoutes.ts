import { Router } from 'express';
import { TripController } from '../controllers/tripController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, TripController.createTrip);
router.get('/', authenticate, TripController.getTrips);
router.get('/:id', authenticate, TripController.getTripById);
router.put('/:id', authenticate, TripController.updateTrip);
router.delete('/:id', authenticate, TripController.deleteTrip);

export default router;

