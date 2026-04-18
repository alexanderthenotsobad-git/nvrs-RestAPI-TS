// /var/www/RestAPI/src/controllers/ingredientController.ts
import { Request, Response } from 'express';
import { IngredientService } from '../services/ingredientService';

const ingredientService = new IngredientService();

export const getAllIngredients = async (req: Request, res: Response) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to fetch ingredients'
        });
    }
};

export const getIngredientById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ingredient ID' });
            return;
        }

        const ingredient = await ingredientService.getIngredientById(id);
        if (!ingredient) {
            res.status(404).json({ message: 'Ingredient not found' });
            return;
        }

        res.status(200).json(ingredient);
    } catch (error) {
        console.error('Error fetching ingredient:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to fetch ingredient'
        });
    }
};

export const createIngredient = async (req: Request, res: Response) => {
    try {
        const { ingredient_name, category, is_allergen, unit_type } = req.body;

        if (!ingredient_name) {
            res.status(400).json({ message: 'Ingredient name is required' });
            return;
        }

        const newIngredientId = await ingredientService.createIngredient({
            ingredient_name,
            category,
            is_allergen: is_allergen || 0,
            unit_type
        });

        res.status(201).json({
            message: 'Ingredient created successfully',
            ingredient_id: newIngredientId
        });
    } catch (error) {
        console.error('Error creating ingredient:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to create ingredient'
        });
    }
};

export const updateIngredient = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ingredient ID' });
            return;
        }

        const { ingredient_name, category, is_allergen, unit_type } = req.body;

        const affectedRows = await ingredientService.updateIngredient(id, {
            ingredient_name,
            category,
            is_allergen,
            unit_type
        });

        if (affectedRows === 0) {
            res.status(404).json({ message: 'Ingredient not found or no changes made' });
            return;
        }

        res.status(200).json({
            message: 'Ingredient updated successfully',
            ingredient_id: id,
            affectedRows
        });
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to update ingredient'
        });
    }
};

export const deleteIngredient = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ingredient ID' });
            return;
        }

        const affectedRows = await ingredientService.deleteIngredient(id);

        if (affectedRows === 0) {
            res.status(404).json({ message: 'Ingredient not found' });
            return;
        }

        res.status(200).json({
            message: 'Ingredient deleted successfully',
            ingredient_id: id
        });
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to delete ingredient'
        });
    }
};