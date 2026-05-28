// /var/www/RestAPI-dev/src/routes/nutritionRoutes.ts
import { Router } from 'express';
import { getNutritionData } from '../controllers/nutritionController';

const router = Router();

// Define the absolute endpoint path
router.get('/', getNutritionData);

export default router;
