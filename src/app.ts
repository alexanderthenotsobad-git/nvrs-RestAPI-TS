// /var/www/RestAPI-dev/src/app.ts
import dotenv from 'dotenv';
import path from 'path';
const envResult = dotenv.config({ path: path.join(__dirname, '../.env') });

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import menuRoutes from './routes/menuRoutes';
import dataImportRoutes from './routes/dataImportRoutes';  // ← ADD THIS
import { connectToDatabase } from './config/db';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import imageRoutes from './routes/imageRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import nutritionRoutes from './routes/nutritionRoutes';

const app: Express = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', menuRoutes);
app.use('/import', dataImportRoutes);  // ← ADD THIS
app.use('/api/images', imageRoutes);
app.use('/', nutritionRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/ingredients', ingredientRoutes);

const PORT = process.env.PORT || 3002;

if (require.main === module) {
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

export default app;