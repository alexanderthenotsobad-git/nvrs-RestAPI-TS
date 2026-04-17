import { createPool, Pool } from 'mysql2/promise';
// Remove dotenv import and config from here since it's handled in app.ts

// Create the pool with TypeScript types and connection stability options
export const pool: Pool = createPool({
    port: Number(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,

    // Connection pool configuration
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // Keep connections alive
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10 seconds

    // Timeouts
    connectTimeout: 60000, // 60 seconds
    maxIdle: 60000, // 60 seconds idle timeout

    // Retry logic
    idleTimeout: 60000
});

// Connection test function with better error handling
export const connectToDatabase = async (): Promise<void> => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("✅ MySQL Connection Successful");

        // Test the connection with a simple query
        await connection.query('SELECT 1');

        console.log("✅ MySQL Connection Test Passed");
        connection.release();
    } catch (error) {
        console.log("❌ Database Connection Error");
        console.error(error);
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.error("Error releasing connection:", releaseError);
            }
        }
        throw error;
    }
};

export default pool;