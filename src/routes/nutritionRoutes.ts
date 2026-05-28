// src/routes/nutritionRoutes.ts
import { Router } from 'express';
import { getNutritionData } from '../controllers/nutritionController';

const router = Router();

// Define the absolute endpoint path
router.get('/nutrition', getNutritionData);

export default router;
