// /var/www/RestAPI-dev/src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NVRS Menu API',
            version: '1.0.0',
            description: 'API documentation for Node Virtual Restaurant Solutions',
            contact: {
                name: 'Alexander Gomez'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.alexanderthenotsobad.us'
                    : 'http://localhost:3003',
                description: process.env.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Development server'
            }
        ],
        components: {
            schemas: {
                MenuItem: {
                    type: 'object',
                    required: ['item_name', 'price', 'item_type'],
                    properties: {
                        item_id: {
                            type: 'integer',
                            description: 'The auto-generated id of the menu item'
                        },
                        item_name: {
                            type: 'string',
                            description: 'The name of the menu item'
                        },
                        item_desc: {
                            type: 'string',
                            description: 'Description of the menu item'
                        },
                        price: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Price of the menu item'
                        },
                        item_type: {
                            type: 'string',
                            description: 'Type/category of the menu item'
                        },
                        dietary_tags: {
                            type: 'string',
                            description: 'Dietary tags (vegetarian, vegan, gluten-free, etc.)',
                            nullable: true
                        },
                        style: {
                            type: 'string',
                            description: 'Cuisine style (american, mexican, italian, etc.)',
                            nullable: true
                        },
                        rating: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Average rating of the menu item',
                            nullable: true
                        },
                        image_id: {
                            type: 'integer',
                            description: 'ID of the associated image',
                            nullable: true
                        }
                    }
                },
                IngredientDetail: {
                    type: 'object',
                    properties: {
                        ingredient_id: {
                            type: 'integer',
                            description: 'The unique identifier of the ingredient'
                        },
                        ingredient_name: {
                            type: 'string',
                            description: 'Name of the ingredient'
                        },
                        category: {
                            type: 'string',
                            enum: ['protein', 'vegetable', 'spice', 'dairy', 'grain', 'oil', 'other'],
                            description: 'Category of the ingredient',
                            nullable: true
                        },
                        is_allergen: {
                            type: 'boolean',
                            description: 'Whether this ingredient is a common allergen'
                        },
                        quantity: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Quantity of the ingredient used',
                            nullable: true
                        },
                        unit: {
                            type: 'string',
                            description: 'Unit of measurement (g, ml, each, etc.)',
                            nullable: true
                        },
                        preparation_note: {
                            type: 'string',
                            description: 'How the ingredient is prepared (chopped, minced, shredded, etc.)',
                            nullable: true
                        },
                        is_optional: {
                            type: 'boolean',
                            description: 'Whether the ingredient can be omitted by request'
                        },
                        spice_level: {
                            type: 'string',
                            description: 'Spice level for spicy ingredients (mild, medium, hot)',
                            nullable: true
                        },
                        custom_attributes: {
                            type: 'object',
                            description: 'Additional JSON attributes for ingredient-specific details',
                            nullable: true
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options);