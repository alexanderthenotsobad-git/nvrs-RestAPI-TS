// /var/www/RestAPI-dev/src/app.ts

import dotenv from 'dotenv';
import path from 'path';
const envResult = dotenv.config({ path: path.join(__dirname, '../.env') });

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import menuRoutes from './routes/menuRoutes';
import dataImportRoutes from './routes/dataImportRoutes';
import { connectToDatabase } from './config/db';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import imageRoutes from './routes/imageRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import nutritionRoutes from './routes/nutritionRoutes';
import redirectRoutes from './routes/redirectRoutes';
import paymentRoutes, { webhookRouter } from './routes/paymentRoutes';
import patronRoutes from './routes/patronRoutes';

const app: Express = express();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// CORS
app.use(cors());

// Webhook route - MUST be before express.json() (raw body required)
app.use('/api', webhookRouter);

// JSON parser for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', paymentRoutes);
app.use('/api', patronRoutes);

// Redirect routes
app.use('/', redirectRoutes);

// Menu and related routes
app.use('/menu', menuRoutes);
app.use('/import', dataImportRoutes);
app.use('/api/images', imageRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/ingredients', ingredientRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3003;

if (require.main === module) {
    console.log("DB Check:", {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        db: process.env.MYSQL_DATABASE_NAME,
        port: process.env.MYSQL_PORT
    });
    connectToDatabase()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch(error => {
            console.error('Failed to start server:', error);
            process.exit(1);
        });
}