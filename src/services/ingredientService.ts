// /var/www/RestAPI-dev/src/services/ingredientService.ts
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';

interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
    category: string | null;
    is_allergen: number;
    unit_type: string | null;
}

interface IngredientRow extends RowDataPacket {
    ingredient_id: number;
    ingredient_name: string;
    category: string | null;
    is_allergen: number;
    unit_type: string | null;
}

export class IngredientService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async getAllIngredients(): Promise<Ingredient[]> {
        const [rows] = await this.pool.query<IngredientRow[]>(
            'SELECT ingredient_id, ingredient_name, category, is_allergen, unit_type FROM ingredients ORDER BY ingredient_name'
        );
        return rows;
    }

    async getIngredientById(id: number): Promise<Ingredient | null> {
        const [rows] = await this.pool.query<IngredientRow[]>(
            'SELECT ingredient_id, ingredient_name, category, is_allergen, unit_type FROM ingredients WHERE ingredient_id = ?',
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async createIngredient(ingredient: Omit<Ingredient, 'ingredient_id'>): Promise<number> {
        const { ingredient_name, category, is_allergen, unit_type } = ingredient;
        const [result] = await this.pool.query<ResultSetHeader>(
            'INSERT INTO ingredients (ingredient_name, category, is_allergen, unit_type) VALUES (?, ?, ?, ?)',
            [ingredient_name, category, is_allergen || 0, unit_type]
        );
        return result.insertId;
    }

    async updateIngredient(id: number, ingredient: Partial<Ingredient>): Promise<number> {
        const { ingredient_name, category, is_allergen, unit_type } = ingredient;

        const updates: string[] = [];
        const values: any[] = [];

        if (ingredient_name !== undefined) {
            updates.push('ingredient_name = ?');
            values.push(ingredient_name);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            values.push(category);
        }
        if (is_allergen !== undefined) {
            updates.push('is_allergen = ?');
            values.push(is_allergen);
        }
        if (unit_type !== undefined) {
            updates.push('unit_type = ?');
            values.push(unit_type);
        }

        if (updates.length === 0) {
            return 0;
        }

        values.push(id);
        const [result] = await this.pool.query<ResultSetHeader>(
            `UPDATE ingredients SET ${updates.join(', ')} WHERE ingredient_id = ?`,
            values
        );
        return result.affectedRows;
    }

    async deleteIngredient(id: number): Promise<number> {
        const [result] = await this.pool.query<ResultSetHeader>(
            'DELETE FROM ingredients WHERE ingredient_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}