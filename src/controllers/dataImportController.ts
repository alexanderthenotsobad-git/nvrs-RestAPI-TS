import { Request, Response } from 'express';
import pool from '../config/db';

export const importMenuItems = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const items = req.body;
        const results = [];

        for (const item of items) {
            const [result] = await connection.query(
                `INSERT INTO menu_items 
         (item_name, item_desc, price, item_type, ingredients, dietary_tags, style, rating) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [item.item_name, item.item_desc, item.price, item.item_type,
                item.ingredients, item.dietary_tags, item.style, item.rating]
            );

            results.push({
                ...item,
                item_id: (result as any).insertId
            });
        }

        await connection.commit();
        res.status(201).json({
            message: 'Menu items imported successfully',
            count: items.length,
            items: results
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import menu items' });
    } finally {
        connection.release();
    }
};

export const importBeverages = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const beverages = req.body;
        const results = [];

        for (const bev of beverages) {
            const [result] = await connection.query(
                `INSERT INTO beverages (beverage_name, beverage_desc, price, item_type) 
         VALUES (?, ?, ?, ?)`,
                [bev.beverage_name, bev.beverage_desc, bev.price, bev.item_type || 'drink']
            );

            results.push({
                ...bev,
                beverage_id: (result as any).insertId
            });
        }

        await connection.commit();
        res.status(201).json({
            message: 'Beverages imported successfully',
            count: beverages.length,
            beverages: results
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import beverages' });
    } finally {
        connection.release();
    }
};

export const importMenuBeveragePairs = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const pairs = req.body;

        for (const pair of pairs) {
            await connection.query(
                `INSERT INTO menu_item_beverages (menu_item_id, beverage_id, pairing_strength) 
         VALUES (?, ?, ?)`,
                [pair.menu_item_id, pair.beverage_id, pair.pairing_strength || 'good']
            );
        }

        await connection.commit();
        res.status(201).json({
            message: 'Beverage pairings imported successfully',
            count: pairs.length
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import beverage pairings' });
    } finally {
        connection.release();
    }
};

export const importNutrition = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const nutritionData = req.body;

        for (const n of nutritionData) {
            await connection.query(
                `INSERT INTO menu_item_nutrition (item_id, calories, protein, fat, carbs) 
         VALUES (?, ?, ?, ?, ?)`,
                [n.item_id, n.calories, n.protein, n.fat, n.carbs]
            );
        }

        await connection.commit();
        res.status(201).json({
            message: 'Nutrition data imported successfully',
            count: nutritionData.length
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import nutrition data' });
    } finally {
        connection.release();
    }
};

export const importPatrons = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const patrons = req.body;
        const results = [];

        for (const patron of patrons) {
            const [result] = await connection.query(
                `INSERT INTO patrons (patron_name, email, password) 
         VALUES (?, ?, ?)`,
                [patron.patron_name, patron.email, patron.password]
            );

            results.push({
                ...patron,
                patron_id: (result as any).insertId
            });
        }

        await connection.commit();
        res.status(201).json({
            message: 'Patrons imported successfully',
            count: patrons.length,
            patrons: results
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import patrons' });
    } finally {
        connection.release();
    }
};

// Note: Your schema is MISSING an order_items table
// You'll need to create this first for order imports to work
export const importOrders = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const orders = req.body;
        const results = [];

        for (const order of orders) {
            const [orderResult] = await connection.query(
                `INSERT INTO orders (patron_id, total_amount) 
         VALUES (?, ?)`,
                [order.patron_id, order.total_amount]
            );

            const orderId = (orderResult as any).insertId;

            // This assumes you have an order_items table
            for (const item of order.items) {
                await connection.query(
                    `INSERT INTO order_items (order_id, item_id, quantity, price_at_time) 
           VALUES (?, ?, ?, ?)`,
                    [orderId, item.item_id, item.quantity, item.price_at_time]
                );
            }

            results.push({
                order_id: orderId,
                ...order
            });
        }

        await connection.commit();
        res.status(201).json({
            message: 'Orders imported successfully',
            count: orders.length,
            orders: results
        });
    } catch (error) {
        await connection.rollback();
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import orders' });
    } finally {
        connection.release();
    }
};