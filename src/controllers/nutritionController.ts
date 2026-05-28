// src/controllers/nutritionController.ts
import { Request, Response } from 'express';
import pool from '../config/db'; // Matches your local db.ts configuration setup

/**
 * @openapi
 * /nutrition:
 *   get:
 *     summary: Retrieve all normalized item nutritional data records
 *     tags:
 *       - Nutrition
 *     responses:
 *       200:
 *         description: A JSON array containing exact item macro properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   item_id:
 *                     type: integer
 *                   calories:
 *                     type: integer
 *                   protein:
 *                     type: integer
 *                   fat:
 *                     type: integer
 *                   carbs:
 *                     type: integer
 *       500:
 *         description: Database internal compilation or server tracking error.
 */

export const getNutritionData = async (req: Request, res: Response): Promise<void> => {
    try {
        // Query your normalized on-premise MySQL container table
        const [rows] = await pool.query(
            'SELECT item_id, calories, protein, fat, carbs FROM nutrition'
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Database execution error on GET /nutrition:', error);
        res.status(500).json({ error: 'Failed to retrieve kitchen nutrition metrics.' });
    }
};
