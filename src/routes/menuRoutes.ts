// src/routes/menuRoutes.ts
import express from 'express';
import { Router } from 'express';
import { getAllMenuItems, createMenuItem, deleteMenuItem } from '../controllers/menuController';

const router = Router();

/**
 * @swagger
 * /menu:
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
router.get('/menu', getAllMenuItems);

/**
 * @swagger
 * /menu:
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
router.post('/menu', createMenuItem);

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