import { Request, Response } from 'express';
import pool from '../config/db';
import { MenuItem } from '../models/menuItem';

export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const { item_name, item_desc, price } = req.body;
        const [result] = await pool.query(
            'INSERT INTO menu_items (item_name, item_desc, price) VALUES (?, ?, ?)',
            [item_name, item_desc, price]
        );
        res.status(201).json({
            message: 'Menu item created successfully',
            data: { item_name, item_desc, price, result }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to insert menu item',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};