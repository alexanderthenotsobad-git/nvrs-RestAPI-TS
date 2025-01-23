import { createPool, Pool } from 'mysql2/promise';
// Remove dotenv import and config from here since it's handled in app.ts

// Create the pool with TypeScript types
export const pool: Pool = createPool({
    port: Number(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

// Connection test function
export const connectToDatabase = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL Connection Successful 🧮️");
        connection.release();
    } catch (error) {
        console.log("Database Connection Error");
        console.error(error);
        throw error;
    }
};

export { pool as default };