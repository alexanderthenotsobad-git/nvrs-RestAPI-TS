// /var/www/RestAPI-dev/src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

// The public entrypoint is Apache → localhost:3003. Default to it so a server
// started without NODE_ENV=production still advertises a usable URL.
const PUBLIC_API_URL = process.env.PUBLIC_API_URL || 'https://ai.alexanderthenotsobad.us';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NVRS Menu API',
            version: '1.0.0',
            description: 'API documentation for Node Virtual Restaurant Solutions',
            contact: {
                name: 'Alexander Gomez'
            },
            license: {
                name: 'ISC'
            }
        },
        servers: [
            {
                url: PUBLIC_API_URL,
                description: 'Public NVRS API (Apache → localhost:3003)'
            }
        ],
        // No endpoint requires an Authorization header today: /api/auth/login
        // returns the patron record, not a token. Declared explicitly so the spec
        // does not imply an unmodeled auth scheme, and so the Stripe webhook is
        // understood to authenticate by signature rather than by header.
        security: [],
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
                            type: 'string',
                            description: 'Price as a JSON string (MySQL DECIMAL). Parse with parseFloat before doing arithmetic. Example: "8.00".',
                            example: '8.00'
                        },
                        item_type: {
                            type: 'string',
                            description: 'Type/category of the menu item'
                        },
                        dietary_tags: {
                            type: 'string',
                            description: 'Dietary tags, comma-separated when there is more than one (e.g. "vegan, gluten-free")',
                            nullable: true
                        },
                        style: {
                            type: 'string',
                            description: 'Cuisine style (american, mexican, italian, etc.)',
                            nullable: true
                        },
                        rating: {
                            type: 'string',
                            description: 'Average rating as a JSON string (MySQL DECIMAL). Example: "4.5".',
                            nullable: true,
                            example: '4.5'
                        },
                        image_id: {
                            type: 'integer',
                            description: 'ID of the associated image',
                            nullable: true
                        }
                    }
                },
                MenuItemWithIngredients: {
                    allOf: [
                        { $ref: '#/components/schemas/MenuItem' },
                        {
                            type: 'object',
                            properties: {
                                ingredients: {
                                    type: 'array',
                                    description: 'Ingredients for this menu item, ordered by name',
                                    items: { $ref: '#/components/schemas/IngredientDetail' }
                                }
                            }
                        }
                    ]
                },
                IngredientDetail: {
                    type: 'object',
                    description: 'One ingredient as prepared within a menu item (rows from menu_item_ingredients joined to ingredients).',
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
                            description: 'Whether this ingredient is a common allergen. Boolean on this endpoint; /ingredients returns 0/1.'
                        },
                        quantity: {
                            type: 'string',
                            description: 'Quantity used, as a JSON string (MySQL DECIMAL). Example: "50.00".',
                            nullable: true,
                            example: '50.00'
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
                },
                Ingredient: {
                    type: 'object',
                    description: 'A row of the ingredient master list (the `ingredients` table).',
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
                            nullable: true
                        },
                        is_allergen: {
                            type: 'integer',
                            enum: [0, 1],
                            description: 'Whether this ingredient is a common allergen. Returned as 0/1 by this endpoint, unlike /menu/with-ingredients which returns a boolean.'
                        },
                        unit_type: {
                            type: 'string',
                            description: 'Default unit family for this ingredient, e.g. "weight" or "volume"',
                            nullable: true
                        }
                    }
                },
                Nutrition: {
                    type: 'object',
                    description: 'Per-menu-item macros (row of menu_item_nutrition).',
                    properties: {
                        item_id: {
                            type: 'integer',
                            description: 'Menu item this nutrition row belongs to'
                        },
                        calories: {
                            type: 'integer',
                            description: 'Calories (integer)'
                        },
                        protein: {
                            type: 'string',
                            description: 'Grams of protein as a JSON string (MySQL DECIMAL). Example: "14.5".',
                            example: '14.5'
                        },
                        fat: {
                            type: 'string',
                            description: 'Grams of fat as a JSON string (MySQL DECIMAL). Example: "24.0".',
                            example: '24.0'
                        },
                        carbs: {
                            type: 'string',
                            description: 'Grams of carbohydrates as a JSON string (MySQL DECIMAL). Example: "48.0".',
                            example: '48.0'
                        }
                    }
                },
                Patron: {
                    type: 'object',
                    properties: {
                        patron_id: {
                            type: 'integer',
                            description: 'Patron identifier'
                        },
                        patron_name: {
                            type: 'string',
                            description: 'Display name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Patron email address'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    description: 'Error envelope used across the API.',
                    required: ['error'],
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Human-readable error message'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options);
