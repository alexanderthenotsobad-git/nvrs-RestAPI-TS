// /var/www/RestAPI/src/services/menuService.ts
import { Pool } from 'mysql2/promise';
import pool from '../config/db';
import { MenuItem } from '../models/menuItem';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

interface MenuItemRow extends RowDataPacket {
    item_id: number;
    item_name: string;
    item_desc: string;
    price: number;
    item_type: string;
    dietary_tags: string | null;
    style: string | null;
    rating: number | null;
    image_data?: Buffer;
    item_image?: Buffer;
    image_id?: number;
    image_type?: string;
}

interface IngredientDetail {
    ingredient_id: number;
    ingredient_name: string;
    category: string | null;
    is_allergen: boolean;
    quantity: number | null;
    unit: string | null;
    preparation_note: string | null;
    is_optional: boolean;
    spice_level: string | null;
    custom_attributes: any;
}

interface MenuItemWithIngredients {
    item_id: number;
    item_name: string;
    item_desc: string;
    price: number;
    item_type: string;
    dietary_tags: string | null;
    style: string | null;
    rating: number | null;
    image_id: number | null;
    ingredients: IngredientDetail[];
}

export class MenuItemService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    /**
     * Retrieves all menu items from the database
     * @returns {Promise<MenuItem[]>} Array of menu items with their associated image IDs
     * @throws {Error} If database query fails
     */
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
                dietary_tags: item.dietary_tags,
                style: item.style,
                rating: item.rating,
                image_id: item.image_id
            }));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch items: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    /**
     * Retrieves all menu items with their full ingredient details
     * @returns {Promise<MenuItemWithIngredients[]>} Array of menu items with nested ingredients arrays
     * @throws {Error} If database query fails
     */
    async getAllMenuItemsWithIngredients(): Promise<MenuItemWithIngredients[]> {
        const query = `
            SELECT 
                m.item_id,
                m.item_name,
                m.item_desc,
                m.price,
                m.item_type,
                m.dietary_tags,
                m.style,
                m.rating,
                mi.image_id,
                i.ingredient_id,
                i.ingredient_name,
                i.category,
                i.is_allergen,
                mii.quantity,
                mii.unit,
                mii.preparation_note,
                mii.is_optional,
                mii.spice_level,
                mii.custom_attributes
            FROM menu_items m
            LEFT JOIN menu_item_images mi ON m.item_id = mi.menu_item_id
            LEFT JOIN menu_item_ingredients mii ON m.item_id = mii.menu_item_id
            LEFT JOIN ingredients i ON mii.ingredient_id = i.ingredient_id
            ORDER BY m.item_id, i.ingredient_name
        `;

        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(query);

            // Group ingredients by menu item
            const menuItemsMap = new Map<number, MenuItemWithIngredients>();

            for (const row of rows) {
                if (!menuItemsMap.has(row.item_id)) {
                    menuItemsMap.set(row.item_id, {
                        item_id: row.item_id,
                        item_name: row.item_name,
                        item_desc: row.item_desc,
                        price: row.price,
                        item_type: row.item_type,
                        dietary_tags: row.dietary_tags,
                        style: row.style,
                        rating: row.rating,
                        image_id: row.image_id,
                        ingredients: []
                    });
                }

                // Add ingredient if it exists
                if (row.ingredient_id) {
                    const menuItem = menuItemsMap.get(row.item_id);
                    if (menuItem) {
                        menuItem.ingredients.push({
                            ingredient_id: row.ingredient_id,
                            ingredient_name: row.ingredient_name,
                            category: row.category,
                            is_allergen: row.is_allergen === 1,
                            quantity: row.quantity,
                            unit: row.unit,
                            preparation_note: row.preparation_note,
                            is_optional: row.is_optional === 1,
                            spice_level: row.spice_level,
                            custom_attributes: row.custom_attributes
                        });
                    }
                }
            }

            return Array.from(menuItemsMap.values());
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch items with ingredients: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    /**
     * Get a single menu item by ID with its ingredients
     * @param {number} itemId - The ID of the menu item
     * @returns {Promise<MenuItemWithIngredients | null>} Menu item with nested ingredients or null if not found
     */
    async getMenuItemWithIngredientsById(itemId: number): Promise<MenuItemWithIngredients | null> {
        const query = `
            SELECT 
                m.item_id,
                m.item_name,
                m.item_desc,
                m.price,
                m.item_type,
                m.dietary_tags,
                m.style,
                m.rating,
                mi.image_id,
                i.ingredient_id,
                i.ingredient_name,
                i.category,
                i.is_allergen,
                mii.quantity,
                mii.unit,
                mii.preparation_note,
                mii.is_optional,
                mii.spice_level,
                mii.custom_attributes
            FROM menu_items m
            LEFT JOIN menu_item_images mi ON m.item_id = mi.menu_item_id
            LEFT JOIN menu_item_ingredients mii ON m.item_id = mii.menu_item_id
            LEFT JOIN ingredients i ON mii.ingredient_id = i.ingredient_id
            WHERE m.item_id = ?
            ORDER BY i.ingredient_name
        `;

        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(query, [itemId]);

            if (rows.length === 0) {
                return null;
            }

            const menuItem: MenuItemWithIngredients = {
                item_id: rows[0].item_id,
                item_name: rows[0].item_name,
                item_desc: rows[0].item_desc,
                price: rows[0].price,
                item_type: rows[0].item_type,
                dietary_tags: rows[0].dietary_tags,
                style: rows[0].style,
                rating: rows[0].rating,
                image_id: rows[0].image_id,
                ingredients: []
            };

            // Add ingredients (filter out rows where ingredient_id is null)
            for (const row of rows) {
                if (row.ingredient_id) {
                    menuItem.ingredients.push({
                        ingredient_id: row.ingredient_id,
                        ingredient_name: row.ingredient_name,
                        category: row.category,
                        is_allergen: row.is_allergen === 1,
                        quantity: row.quantity,
                        unit: row.unit,
                        preparation_note: row.preparation_note,
                        is_optional: row.is_optional === 1,
                        spice_level: row.spice_level,
                        custom_attributes: row.custom_attributes
                    });
                }
            }

            return menuItem;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch menu item: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    /**
     * Get an image by its ID
     * @param {number} imageId - The ID of the image to retrieve
     * @returns {Promise<{data: Buffer, type: string} | null>} The image data and MIME type, or null if not found
     * @throws {Error} If database query fails
     */
    async getMenuItemImage(imageId: number): Promise<{ data: Buffer; type: string } | null> {
        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(
                'SELECT image_data, image_type FROM menu_item_images WHERE image_id = ?',
                [imageId]
            );

            if (rows.length === 0) {
                return null;
            }

            return {
                data: rows[0].image_data,
                type: rows[0].image_type
            };
        } catch (error) {
            console.error('Error getting image:', error);
            throw new Error('Failed to retrieve image');
        }
    }

    /**
     * Delete a specific image by its ID
     * @param {number} imageId - The ID of the image to delete
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async deleteImageById(imageId: number): Promise<boolean> {
        try {
            const [result] = await this.pool.query<ResultSetHeader>(
                'DELETE FROM menu_item_images WHERE image_id = ?',
                [imageId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting image:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to delete image: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    /**
     * Gets the most recent image ID for a menu item
     * @param {number} menuItemId - The ID of the menu item
     * @returns {Promise<number | null>} The ID of the most recent image, or null if no images exist
     * @throws {Error} If database query fails
     */
    async getLatestImageIdForMenuItem(menuItemId: number): Promise<number | null> {
        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(
                'SELECT image_id FROM menu_item_images WHERE menu_item_id = ? ORDER BY upload_date DESC LIMIT 1',
                [menuItemId]
            );

            if (rows.length === 0) {
                return null;
            }

            return rows[0].image_id;
        } catch (error) {
            console.error('Error getting latest image ID:', error);
            throw new Error('Failed to retrieve latest image ID');
        }
    }

    /**
     * Get all images for a specific menu item
     * @param {number} menuItemId - The ID of the menu item to retrieve images for
     * @returns {Promise<Array<{image_id: number, upload_date: Date}>>} Array of objects containing image_id and upload_date
     * @throws {Error} If database query fails
     */
    async getAllImagesForMenuItem(menuItemId: number): Promise<{ image_id: number; upload_date: Date }[]> {
        try {
            const [rows] = await this.pool.query<RowDataPacket[]>(
                'SELECT image_id, upload_date FROM menu_item_images WHERE menu_item_id = ? ORDER BY upload_date DESC',
                [menuItemId]
            );
            return rows as { image_id: number; upload_date: Date }[];
        } catch (error) {
            console.error('Error getting images for menu item:', error);
            throw new Error('Failed to retrieve images for menu item');
        }
    }

    /**
     * Upload an image for a menu item
     * @param {number} menuItemId - The ID of the menu item
     * @param {Buffer} imageData - The image data as a Buffer
     * @param {string} imageType - The MIME type of the image
     * @returns {Promise<number>} The ID of the newly created image
     * @throws {Error} If menu item is not found or database operation fails
     */
    async uploadMenuItemImage(
        menuItemId: number,
        imageData: Buffer,
        imageType: string
    ): Promise<number> {
        try {
            const [menuItems] = await this.pool.query<RowDataPacket[]>(
                'SELECT * FROM menu_items WHERE item_id = ?',
                [menuItemId]
            );

            if (menuItems.length === 0) {
                throw new Error('Menu item not found');
            }

            const [result] = await this.pool.query<ResultSetHeader>(
                'INSERT INTO menu_item_images (menu_item_id, image_data, image_type) VALUES (?, ?, ?)',
                [menuItemId, imageData, imageType]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    /**
     * Create a new menu item
     * @param {Omit<MenuItem, 'item_id'>} menuItem - The menu item data without an ID
     * @returns {Promise<number>} The ID of the newly created menu item
     * @throws {Error} If database operation fails
     */
    async createMenuItem(menuItem: Omit<MenuItem, 'item_id'>): Promise<number> {
        const { item_name, item_desc, price, item_type } = menuItem;
        const [result] = await this.pool.query<ResultSetHeader>(
            'INSERT INTO menu_items (item_name, item_desc, price, item_type) VALUES (?, ?, ?, ?)',
            [item_name, item_desc, price, item_type]
        );
        return result.insertId;
    }

    /**
     * Update a menu item
     * @param {number} itemId - The ID of the menu item to update
     * @param {Partial<MenuItem>} menuItem - The menu item data to update
     * @returns {Promise<number>} The number of affected rows
     * @throws {Error} If database operation fails
     */
    async updateMenuItem(itemId: number, menuItem: Partial<MenuItem>): Promise<number> {
        try {
            const { item_name, item_desc, price, item_type } = menuItem;

            const updates: string[] = [];
            const values: any[] = [];

            if (item_name !== undefined) {
                updates.push('item_name = ?');
                values.push(item_name);
            }

            if (item_desc !== undefined) {
                updates.push('item_desc = ?');
                values.push(item_desc);
            }

            if (price !== undefined) {
                updates.push('price = ?');
                values.push(price);
            }

            if (item_type !== undefined) {
                updates.push('item_type = ?');
                values.push(item_type);
            }

            if (updates.length === 0) {
                return 0;
            }

            values.push(itemId);

            const query = `UPDATE menu_items SET ${updates.join(', ')} WHERE item_id = ?`;

            const [result] = await this.pool.query(query, values);

            return (result as any).affectedRows;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update menu item: ${error.message}`);
            }
            throw new Error('Unknown database error');
        }
    }

    /**
     * Delete a menu item by name
     * @param {string} item_name - The name of the menu item to delete
     * @returns {Promise<number>} The number of affected rows
     * @throws {Error} If database operation fails
     */
    async deleteMenuItem(item_name: string): Promise<number> {
        const [result] = await this.pool.query<ResultSetHeader>(
            'DELETE FROM menu_items WHERE item_name = ?',
            [item_name]
        );
        return result.affectedRows;
    }
}