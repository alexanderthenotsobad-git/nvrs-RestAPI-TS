// /var/www/RestAPI/src/services/menuService.ts
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
    image_data?: Buffer;
    item_image?: Buffer;
}

export class MenuItemService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async getAllMenuItems(): Promise<MenuItem[]> {
        const query = `
            SELECT m.*, mi.image_id, mi.image_type
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
                item_type: item.item_type,
                image_id: item.image_id
            }));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch items: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }
    // Add to MenuItemService class in menuService.ts

    async getMenuItemImage(imageId: number): Promise<{ data: Buffer, type: string } | null> {
        const query = `
            SELECT image_data, image_type 
            FROM menu_item_images 
            WHERE image_id = ?
        `;

        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(query, [imageId]);

            if (rows.length === 0) {
                return null;
            }

            return {
                data: rows[0].image_data,
                type: rows[0].image_type
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch image: ${error.message}`);
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