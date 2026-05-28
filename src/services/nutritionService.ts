import { Pool, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

interface NutritionData {
    item_id: number;
    calories: number | null;
    protein: number | null;
    fat: number | null;
    carbs: number | null;
}

interface NutritionRow extends RowDataPacket {
    item_id: number;
    calories: number | null;
    protein: number | null;
    fat: number | null;
    carbs: number | null;
}

export class NutritionService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async getAllNutrition(): Promise<NutritionData[]> {
        const [rows] = await this.pool.query<NutritionRow[]>(
            'SELECT item_id, calories, protein, fat, carbs FROM menu_item_nutrition'
        );
        return rows;
    }

    async getNutritionByItemId(item_id: number): Promise<NutritionData | null> {
        const [rows] = await this.pool.query<NutritionRow[]>(
            'SELECT item_id, calories, protein, fat, carbs FROM menu_item_nutrition WHERE item_id = ?',
            [item_id]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}