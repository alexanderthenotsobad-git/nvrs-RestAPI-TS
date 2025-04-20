// /var/www/RestAPI/src/routes/imageRoutes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getMenuItemImage, uploadMenuItemImage } from '../controllers/imageController';

const router = express.Router(); // Use this syntax instead of directly importing Router

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, 'menu-item-' + uniqueSuffix + ext);
    }
});

// Add file filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter
});

/**
 * @swagger
 * /api/images/{imageId}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get menu item image
 *     description: Retrieves an image by ID
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
router.get('/:imageId', getMenuItemImage);

/**
 * @swagger
 * /api/images/menu-item/{menuItemId}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get menu item image by menu item ID
 *     description: Retrieves the most recent image for a menu item
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu Item ID
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
router.get('/menu-item/:menuItemId', getMenuItemImage);

/**
 * @swagger
 * /api/images/menu-item/{menuItemId}:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image for a menu item
 *     description: Uploads a new image for a specific menu item
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the menu item
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.post('/menu-item/:menuItemId', upload.single('image'), uploadMenuItemImage);

/**
 * @swagger
 * /api/images/upload/{menuItemId}:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image for a menu item (alternative route)
 *     description: Uploads a new image for a specific menu item
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the menu item
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
router.post('/upload/:menuItemId', upload.single('image'), uploadMenuItemImage);

export default router;