// src/scripts/insertImage.ts
import fs from 'fs';
import { createPool } from 'mysql2/promise';

// Create connection pool with explicit credentials
const pool = createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'nvrs', // Replace with your MySQL password
    database: 'nvrs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function insertImage(
    menuItemId: number,
    imagePath: string,
    imageType: string = 'image/jpeg'
): Promise<number> {
    try {
        // Read image file
        const imageData = fs.readFileSync(imagePath);

        // Insert image
        const [result] = await pool.query(
            'INSERT INTO menu_item_images (menu_item_id, image_data, image_type) VALUES (?, ?, ?)',
            [menuItemId, imageData, imageType]
        );

        console.log(`Image inserted successfully. Image ID: ${(result as any).insertId}`);

        return (result as any).insertId;
    } catch (error) {
        console.error('Error inserting image:', error);
        throw error;
    }
}

// Usage example
async function main() {
    try {
        // Replace with actual values
        const menuItemId = 2;
        const imagePath = '/var/lib/mysql-files/water.jpg';
        const imageType = 'image/jpeg';

        const imageId = await insertImage(menuItemId, imagePath, imageType);
        console.log(`Done. Image ID: ${imageId}`);

        // Close pool when done
        await pool.end();
    } catch (err) {
        console.error('Script failed:', err);
    } finally {
        process.exit(0);
    }
}

// Run script
main();