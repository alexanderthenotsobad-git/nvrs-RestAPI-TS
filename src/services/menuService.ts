// src/services/menuService.ts
import { Pool } from 'mysql2/promise';
import pool from '../config/db';
import { MenuItem } from '../models/menuItem';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface MenuItemRow extends RowDataPacket {
    item_id: number;
    item_name: string;
    item_desc: string;
    price: number;
    item_type: string;
    item_image?: Buffer;
}

export class MenuItemService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async getAllMenuItems(): Promise<MenuItem[]> {
        const query = `
            SELECT m.*, mi.item_image 
            FROM menu_items m 
            LEFT JOIN menu_item_images mi ON m.item_id = mi.menu_item_id
        `;

        try {
            const [results] = await this.pool.query<MenuItemRow[]>(query);
            return results.map(item => ({
                item_id: item.item_id,
                item_name: item.item_name,
                item_desc: item.item_desc,
                price: item.price,
                item_type: item.item_type
            }));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch items: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    async createMenuItem(menuItem: Omit<MenuItem, 'item_id'>): Promise<number> {
        const { item_name, item_desc, price, item_type } = menuItem;
        const [result] = await this.pool.query<ResultSetHeader>(
            'INSERT INTO menu_items (item_name, item_desc, price, item_type) VALUES (?, ?, ?, ?)',
            [item_name, item_desc, price, item_type]
        );
        return result.insertId;
    }

    async deleteMenuItem(item_name: string): Promise<number> {
        const [result] = await this.pool.query<ResultSetHeader>(
            'DELETE FROM menu_items WHERE item_name = ?',
            [item_name]
        );
        return result.affectedRows;
    }
}