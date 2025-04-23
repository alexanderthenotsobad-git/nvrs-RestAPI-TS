// /var/www/RestAPI/src/routes/menuRoutes.ts
import express from 'express';
import { Router } from 'express';
import { getAllMenuItems, createMenuItem, deleteMenuItem, updateMenuItem } from '../controllers/menuController';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Menu Items
 *     summary: Get all menu items
 *     description: Retrieves all menu items from the database
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
 * /createMenuItem:
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
 *             $ref: '#/components/schemas/MenuItem'
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
 *                 format: decimal
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
router.put('/menu/:id', updateMenuItem);

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
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.delete('/menu/:id', deleteMenuItem);

export default router;