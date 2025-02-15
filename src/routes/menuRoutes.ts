// src/routes/menuRoutes.ts
import express from 'express';
import { Router } from 'express';
import { getAllMenuItems, createMenuItem, deleteMenuItem } from '../controllers/menuController';

const router = Router();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     responses:
 *       200:
 *         description: List of menu items from the nvrs.menu_items table
 */
router.get('/menu', getAllMenuItems);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Post a menu item
 *     responses:
 *       200:
 *         description: Insert a menu item into the nvrs.menu_items table
 */
router.post('/menu', createMenuItem);

/**
 * @swagger
 * /menu:
 *   delete:
 *     summary: Delete a menu item
 *     responses:
 *       200:
 *         description: Delete a menu item from the nvrs.menu_items table
 */
router.delete('/menu', deleteMenuItem);

export default router;