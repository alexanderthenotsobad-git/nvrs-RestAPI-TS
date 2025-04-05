"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var menuController_1 = require("../controllers/menuController");
var router = (0, express_1.Router)();
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
router.get('/', menuController_1.getAllMenuItems);
/**
 * @swagger
 * /createManuItem:
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
router.post('/createMenuItem', menuController_1.createMenuItem);
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
router.delete('/menu/:id', menuController_1.deleteMenuItem);
exports.default = router;
