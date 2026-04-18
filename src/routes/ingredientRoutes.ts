// /var/www/RestAPI/src/routes/ingredientRoutes.ts
import { Router } from 'express';
import {
    getAllIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient
} from '../controllers/ingredientController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Ingredient management endpoints
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of all ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 *       500:
 *         description: Server error
 */
router.get('/', getAllIngredients);

/**
 * @swagger
 * /ingredients/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *     responses:
 *       200:
 *         description: Ingredient found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getIngredientById);

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredient_name
 *             properties:
 *               ingredient_name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [protein, vegetable, spice, dairy, grain, oil, other]
 *               is_allergen:
 *                 type: boolean
 *                 default: false
 *               unit_type:
 *                 type: string
 *                 enum: [weight, volume, count, each]
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', createIngredient);

/**
 * @swagger
 * /ingredients/{id}:
 *   put:
 *     summary: Update an ingredient
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_name:
 *                 type: string
 *               category:
 *                 type: string
 *               is_allergen:
 *                 type: boolean
 *               unit_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateIngredient);

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Delete an ingredient
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *     responses:
 *       200:
 *         description: Ingredient deleted successfully
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteIngredient);

export default router;