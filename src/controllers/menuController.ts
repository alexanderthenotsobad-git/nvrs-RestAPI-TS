// /var/www/RestAPI/src/controllers/menuController.ts
import { Request, Response } from 'express';
import { MenuItemService } from '../services/menuService';
import fs from 'fs';
import path from 'path';

const menuItemService = new MenuItemService();

export const getAllMenuItems = async (req: Request, res: Response) => {
    try {
        const items = await menuItemService.getAllMenuItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Get all menu items with their full ingredient details
 * Returns nested ingredients array for each menu item
 */
export const getAllMenuItemsWithIngredients = async (req: Request, res: Response) => {
    try {
        const items = await menuItemService.getAllMenuItemsWithIngredients();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Get a single menu item by ID with its full ingredient details
 * Returns the menu item with nested ingredients array
 */
export const getMenuItemWithIngredientsById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid menu item ID' });
            return;
        }

        const item = await menuItemService.getMenuItemWithIngredientsById(id);

        if (!item) {
            res.status(404).json({ message: 'Menu item not found' });
            return;
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const newItemId = await menuItemService.createMenuItem(req.body);
        res.status(201).json({ item_id: newItemId });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemId = parseInt(req.params.id, 10);

        // Validate itemId
        if (isNaN(itemId)) {
            res.status(400).json({ message: 'Invalid menu item ID' });
            return;
        }

        // Validate request body
        const { item_name, item_desc, price, item_type } = req.body;

        // Check if at least one field is provided
        if (!item_name && item_desc === undefined && price === undefined && item_type === undefined) {
            res.status(400).json({ message: 'At least one field must be provided for update' });
            return;
        }

        // Call service to update the item
        const affectedRows = await menuItemService.updateMenuItem(itemId, req.body);

        if (affectedRows === 0) {
            res.status(404).json({ message: 'Menu item not found or no changes were made' });
            return;
        }

        res.status(200).json({
            message: 'Menu item updated successfully',
            itemId,
            affectedRows
        });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        const { item_name } = req.body;
        const affectedRows = await menuItemService.deleteMenuItem(item_name);
        res.json({ affectedRows });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
};