// /var/www/RestAPI/src/controllers/imageController.ts
import { Request, Response } from 'express';
import { MenuItemService } from '../services/menuService';
import fs from 'fs';

const menuItemService = new MenuItemService();

export const getMenuItemImage = async (req: Request, res: Response): Promise<void> => {
    try {
        // Handle different types of requests - either by image ID or by menu item ID
        const imageId = req.params.imageId;
        const menuItemId = req.params.menuItemId;

        // If we have an image ID, get the image directly
        if (imageId) {
            const id = parseInt(imageId, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid image ID' });
                return;
            }

            const image = await menuItemService.getMenuItemImage(id);
            if (!image) {
                res.status(404).json({ message: 'Image not found' });
                return;
            }

            res.contentType(image.type);
            res.send(image.data);
            return;
        }

        // If we have a menu item ID, get the latest image for that menu item
        if (menuItemId) {
            const id = parseInt(menuItemId, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid menu item ID' });
                return;
            }

            // This is the modification - fetch ALL images for this menu item
            const images = await menuItemService.getAllImagesForMenuItem(id);
            if (!images || images.length === 0) {
                res.status(404).json({ message: 'No image found for this menu item' });
                return;
            }

            // Use the first image (most recent)
            const imageData = await menuItemService.getMenuItemImage(images[0].image_id);
            if (!imageData) {
                res.status(404).json({ message: 'Image data not found' });
                return;
            }

            res.contentType(imageData.type);
            res.send(imageData.data);
            return;
        }

        // If neither image ID nor menu item ID is provided
        res.status(400).json({ message: 'Missing required parameters' });

    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete all images associated with a specific menu item
 * This is used when changing an image to prevent duplicate entries
 */
/**
 * Delete a specific image by its ID
 * @param req - Express request object containing imageId parameter
 * @param res - Express response object
 */
export const deleteImageById = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse and validate image ID
        const imageId = parseInt(req.params.imageId, 10);

        if (isNaN(imageId)) {
            res.status(400).json({ message: 'Invalid image ID' });
            return;
        }

        // Check if the image exists before deleting
        const image = await menuItemService.getMenuItemImage(imageId);
        if (!image) {
            res.status(404).json({ message: 'Image not found' });
            return;
        }

        // Delete the image using the service method
        const deleted = await menuItemService.deleteImageById(imageId);

        if (deleted) {
            res.status(200).json({
                message: 'Image deleted successfully',
                imageId: imageId
            });
        } else {
            res.status(500).json({ message: 'Failed to delete image' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error deleting image'
        });
    }
};

export const uploadMenuItemImage = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract menuItemId from request parameters
        const menuItemId = parseInt(req.params.menuItemId, 10);

        // Validate menuItemId
        if (isNaN(menuItemId)) {
            res.status(400).json({ message: 'Invalid menu item ID' });
            return;
        }

        // Check if a file was uploaded
        if (!req.file) {
            res.status(400).json({ message: 'No image file uploaded' });
            return;
        }

        // Read the uploaded file
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = req.file.mimetype;

        // Call service to save image to database
        try {
            const imageId = await menuItemService.uploadMenuItemImage(menuItemId, fileBuffer, mimeType);

            // Delete temporary file after successful upload
            fs.unlinkSync(filePath);

            // Return success response in format expected by the frontend
            res.status(201).json({
                message: 'Image uploaded successfully',
                imageId: imageId,
                menuItemId: menuItemId
            });
        } catch (error) {
            // Delete temporary file in case of database error
            fs.unlinkSync(filePath);
            throw error;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error uploading image'
        });
    }
};