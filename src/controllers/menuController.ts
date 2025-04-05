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

export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const newItemId = await menuItemService.createMenuItem(req.body);
        res.status(201).json({ item_id: newItemId });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
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