// /var/www/RestAPI/src/routes/imageRoutes.ts
import express from 'express';
import { getMenuItemImage } from '../controllers/imageController';

const router = express.Router(); // Use this syntax instead of directly importing Router

/**
 * @swagger
 * /menu-item/{imageId}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get menu item image
 *     description: Retrieves an image for a menu item
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image returned successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.get('/menu-item/:imageId', getMenuItemImage);

export default router;