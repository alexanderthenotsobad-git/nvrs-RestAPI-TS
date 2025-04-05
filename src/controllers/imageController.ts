// /var/www/RestAPI/src/controllers/imageController.ts
import { Request, Response } from 'express';
import { MenuItemService } from '../services/menuService';

const menuItemService = new MenuItemService();

export const getMenuItemImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageId = parseInt(req.params.imageId, 10);

        if (isNaN(imageId)) {
            res.status(400).json({ message: 'Invalid image ID' });
            return;
        }

        const image = await menuItemService.getMenuItemImage(imageId);

        if (!image) {
            res.status(404).json({ message: 'Image not found' });
            return;
        }

        res.contentType(image.type);
        res.send(image.data);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};