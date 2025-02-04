import dotenv from 'dotenv';
import path from 'path';
const envResult = dotenv.config({
    path: path.join(__dirname, '../.env')
});
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import testRoutes from './routes/testRoutes';
import menuTestRoutes from './routes/menuRoutes';
import { connectToDatabase } from './config/db';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/test', testRoutes);
app.use('/', menuTestRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3002;

if (require.main === module) {
    connectToDatabase()
        .then(() => {
            //console.log('MySQL Connection Successful');
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