// /var/www/RestAPI/src/routes/imageRoutes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getMenuItemImage, uploadMenuItemImage, deleteImageById } from '../controllers/imageController';

const router = express.Router();

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
 * /api/images/menu-item/{menuItemId}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get image by menu item ID
 *     description: Retrieves the most recent image associated with a specific menu item
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu item whose image is to be retrieved
 *     responses:
 *       200:
 *         description: Image returned successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No image found for this menu item
 *       500:
 *         description: Server error occurred while retrieving the image
 */
router.get('/menu-item/:menuItemId', getMenuItemImage);

/**
 * @swagger
 * /api/images/menu-item/{menuItemId}:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image for a menu item
 *     description: Uploads a new image file and associates it with a specific menu item in the database
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the menu item to associate with the uploaded image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (JPEG, PNG, GIF, etc.)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 imageId:
 *                   type: integer
 *                   example: 42
 *                 menuItemId:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Bad request - invalid file or menu item ID
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error occurred during upload
 */
router.post('/menu-item/:menuItemId', upload.single('image'), uploadMenuItemImage);

/**
 * @swagger
 * /api/images/upload/{menuItemId}:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image for a menu item (alternative route)
 *     description: Alternative endpoint for uploading an image file for a menu item. Functionally identical to '/api/images/menu-item/{menuItemId}'
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the menu item to associate with the uploaded image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (JPEG, PNG, GIF, etc.)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 imageId:
 *                   type: integer
 *                   example: 42
 *                 menuItemId:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Bad request - invalid file or menu item ID
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error occurred during upload
 */
router.post('/upload/:menuItemId', upload.single('image'), uploadMenuItemImage);

/**
 * @swagger
 * /api/images/{imageId}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get menu item image by image ID
 *     description: Retrieves an image from the database by its unique image ID
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the image
 *     responses:
 *       200:
 *         description: Image returned successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found in the database
 *       500:
 *         description: Server error occurred while retrieving the image
 */
router.get('/:imageId', getMenuItemImage);

/**
 * @swagger
 * /api/images/{imageId}:
 *   delete:
 *     tags:
 *       - Images
 *     summary: Delete a specific image by ID
 *     description: Removes a specific image from the database based on its unique ID
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *                 imageId:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Invalid image ID
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error occurred while deleting the image
 */
router.delete('/:imageId', deleteImageById); // New route for deleting by image_id

export default router;