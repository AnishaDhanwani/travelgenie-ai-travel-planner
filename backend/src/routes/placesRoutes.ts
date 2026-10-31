import { Router } from 'express';
import { PlacesController } from '../controllers/placesController';

const router = Router();

router.get('/geocode', PlacesController.geocode);
router.get('/search', PlacesController.searchPlaces);

export default router;

