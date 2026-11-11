// /var/www/RestAPI-dev/src/routes/menuRoutes.ts
import express from 'express';
import { Router } from 'express';
import {
    getAllMenuItems,
    createMenuItem,
    deleteMenuItem,
    updateMenuItem,
    getAllMenuItemsWithIngredients,
    getMenuItemWithIngredientsById
} from '../controllers/menuController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Menu Items
 *   description: Menu item endpoints
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     tags:
 *       - Menu Items
 *     summary: Get all menu items
 *     description: Retrieves all menu items from the database (basic info only, no ingredients)
 *     responses:
 *       200:
 *         description: A list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Server error
 */
router.get('/', getAllMenuItems);

/**
 * @swagger
 * /menu/with-ingredients:
 *   get:
 *     tags:
 *       - Menu Items
 *     summary: Get all menu items with ingredients
 *     description: >
 *       Retrieves all menu items with their complete ingredient details nested inside.
 *       This is the endpoint the AI consultant consumes for allergen- and macro-aware
 *       recommendations.
 *     responses:
 *       200:
 *         description: A list of menu items with ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItemWithIngredients'
 *       500:
 *         description: Server error
 */
router.get('/with-ingredients', getAllMenuItemsWithIngredients);

/**
 * @swagger
 * /menu/{id}/with-ingredients:
 *   get:
 *     tags:
 *       - Menu Items
 *     summary: Get a menu item by ID with its ingredients
 *     description: Retrieves a single menu item with its complete ingredient details nested inside
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item with ingredients found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemWithIngredients'
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.get('/:id/with-ingredients', getMenuItemWithIngredientsById);

/**
 * @swagger
 * /menu/createMenuItem:
 *   post:
 *     tags:
 *       - Menu Items
 *     summary: Create a new menu item
 *     description: Adds a new menu item to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_name, price, item_type]
 *             properties:
 *               item_name:
 *                 type: string
 *               item_desc:
 *                 type: string
 *               price:
 *                 type: number
 *                 description: Price in USD
 *               item_type:
 *                 type: string
 *               dietary_tags:
 *                 type: string
 *                 description: Comma-separated when more than one, e.g. "vegan, gluten-free"
 *               style:
 *                 type: string
 *               rating:
 *                 type: number
 *               image_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/createMenuItem', createMenuItem);

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     tags:
 *       - Menu Items
 *     summary: Update a menu item
 *     description: Updates an existing menu item in the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *                 description: The name of the menu item
 *               item_desc:
 *                 type: string
 *                 description: Description of the menu item
 *               price:
 *                 type: number
 *                 description: Price of the menu item
 *               item_type:
 *                 type: string
 *                 description: Type/category of the menu item
 *             example:
 *               item_name: "Updated Burger"
 *               item_desc: "A delicious updated burger with special sauce"
 *               price: 12.99
 *               item_type: "Main Course"
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item updated successfully"
 *                 itemId:
 *                   type: integer
 *                   example: 1
 *                 affectedRows:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateMenuItem);

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     tags:
 *       - Menu Items
 *     summary: Delete a menu item
 *     description: Deletes a menu item from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteMenuItem);

export default router;
