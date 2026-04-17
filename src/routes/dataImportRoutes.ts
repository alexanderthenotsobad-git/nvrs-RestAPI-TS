import { Router } from 'express';
import {
    importMenuItems,
    importNutrition,
    importPatrons,
    importOrders,
    importBeverages,
    importMenuBeveragePairs
} from '../controllers/dataImportController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Import
 *   description: Bulk data import endpoints
 */

/**
 * @swagger
 * /menu-items:
 *   post:
 *     summary: Import multiple menu items
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 item_name:
 *                   type: string
 *                 item_desc:
 *                   type: string
 *                 price:
 *                   type: number
 *                 item_type:
 *                   type: string
 *                 ingredients:
 *                   type: string
 *                 dietary_tags:
 *                   type: string
 *                 style:
 *                   type: string
 *                 rating:
 *                   type: number
 *     responses:
 *       201:
 *         description: Menu items imported successfully
 *       500:
 *         description: Failed to import menu items
 */
router.post('/menu-items', importMenuItems);

/**
 * @swagger
 * /beverages:
 *   post:
 *     summary: Import multiple beverages
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 beverage_name:
 *                   type: string
 *                 beverage_desc:
 *                   type: string
 *                 price:
 *                   type: number
 *                 item_type:
 *                   type: string
 *     responses:
 *       201:
 *         description: Beverages imported successfully
 *       500:
 *         description: Failed to import beverages
 */
router.post('/beverages', importBeverages);

/**
 * @swagger
 * /nutrition:
 *   post:
 *     summary: Import nutrition data for menu items
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 item_id:
 *                   type: integer
 *                 calories:
 *                   type: integer
 *                 protein:
 *                   type: number
 *                 fat:
 *                   type: number
 *                 carbs:
 *                   type: number
 *     responses:
 *       201:
 *         description: Nutrition data imported successfully
 *       500:
 *         description: Failed to import nutrition data
 */
router.post('/nutrition', importNutrition);

// Import routes

/**
 * @swagger
 * /patrons:
 *   post:
 *     summary: Import multiple patrons
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 patron_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       201:
 *         description: Patrons imported successfully
 *       500:
 *         description: Failed to import patrons
 */
router.post('/patrons', importPatrons);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Import multiple orders
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 patron_id:
 *                   type: integer
 *                 total_amount:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       item_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       price_at_time:
 *                         type: number
 *     responses:
 *       201:
 *         description: Orders imported successfully
 *       500:
 *         description: Failed to import orders
 */
router.post('/orders', importOrders);

/**
 * @swagger
 * /beverage-pairs:
 *   post:
 *     summary: Import menu item beverage pairings
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 menu_item_id:
 *                   type: integer
 *                 beverage_id:
 *                   type: integer
 *                 pairing_strength:
 *                   type: string
 *                   enum: [perfect, great, good]
 *     responses:
 *       201:
 *         description: Beverage pairings imported successfully
 *       500:
 *         description: Failed to import beverage pairings
 */
router.post('/beverage-pairs', importMenuBeveragePairs);

export default router;