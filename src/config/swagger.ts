// /var/www/RestAPI/src/config/swagger.ts
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
                    : 'http://localhost:3002',
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
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options);