// /var/wwww/RestAPI-dev// src/controllers/nutritionController.ts
import { Request, Response } from 'express';
import pool from '../config/db'; // Matches local db.ts configuration setup
import { NutritionService } from '../services/nutritionService';

const nutritionService = new NutritionService;

/**
 * @swagger
 * tags:
 *   name: Nutrition
 *   description: Per-item macro data
 */

/**
 * @swagger
 * /nutrition:
 *   get:
 *     tags:
 *       - Nutrition
 *     summary: Retrieve all item nutrition records
 *     description: >
 *       Returns every row of menu_item_nutrition. Macro values (protein, fat,
 *       carbs) are MySQL DECIMALs and therefore arrive as JSON strings; only
 *       calories is numeric. Join to /menu by item_id.
 *     responses:
 *       200:
 *         description: A JSON array of macro rows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nutrition'
 *       500:
 *         description: Database or server error
 */

export const getNutritionData = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query(
            'SELECT item_id, calories, protein, fat, carbs FROM menu_item_nutrition'
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database execution error on GET /nutrition:', error);
        res.status(500).json({ error: 'Failed to retrieve kitchen nutrition metrics.' });
    }
};
