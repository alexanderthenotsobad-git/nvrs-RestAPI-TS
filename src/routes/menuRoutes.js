"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     responses:
 *       200:
 *         description: List of menu items from the nvrs.menu_items table
 */
router.get('/menu', menuController_1.getAllMenuItems);
/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Post a menu item
 *     responses:
 *       200:
 *         description: Insert a menu item into the nvrs.menu_items table
 */
router.post('/menu', menuController_1.createMenuItem);
/**
 * @swagger
 * /menu:
 *   delete:
 *     summary: Delete a menu item
 *     responses:
 *       200:
 *         description: Delete a menu item from the nvrs.menu_items table
 */
router.delete('/menu', menuController_1.deleteMenuItem);
exports.default = router;
