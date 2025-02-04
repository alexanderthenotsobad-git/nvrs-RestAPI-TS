import { Request, Response } from 'express';
import pool from '../config/db';
import { MenuItem } from '../models/menuItem';

export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const { item_name, item_desc, price, item_type } = req.body;
        const [result] = await pool.query(
            'INSERT INTO menu_items (item_name, item_desc, price) VALUES (?, ?, ?)',
            [item_name, item_desc, price, item_type]
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

export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        const { item_name } = req.body;  // We only need item_name for deletion

        // Use parameterized query to prevent SQL injection
        const [result] = await pool.query(
            'DELETE FROM menu_items WHERE item_name = ?',
            [item_name]
        );

        res.status(200).json({  // 200 is more appropriate than 201 for DELETE
            message: 'Menu item deleted successfully',
            data: { result }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete menu item',  // Updated error message
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};