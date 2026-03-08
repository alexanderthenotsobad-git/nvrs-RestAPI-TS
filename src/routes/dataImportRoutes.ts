import { Router } from 'express';
import {
    importMenuItems,
    importBeverages,
    importMenuBeveragePairs,
    importNutrition,
    importPatrons,
    importOrders
} from '../controllers/dataImportController';

const router = Router();

// Import routes - protect these in production!
router.post('/import/menu-items', importMenuItems);
router.post('/import/beverages', importBeverages);
router.post('/import/menu-beverage-pairs', importMenuBeveragePairs);
router.post('/import/nutrition', importNutrition);
router.post('/import/patrons', importPatrons);
router.post('/import/orders', importOrders);

export default router;