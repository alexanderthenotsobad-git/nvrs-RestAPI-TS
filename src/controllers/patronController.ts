import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

// GET /api/patrons - List all patrons
export const getAllPatrons = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT patron_id, patron_name, email FROM patrons ORDER BY patron_id'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching patrons:', error);
        res.status(500).json({ error: 'Failed to fetch patrons' });
    }
};

// GET /api/patrons/:id - Get single patron by ID
export const getPatronById = async (req: Request, res: Response): Promise<void> => {
    try {
        const patronId = parseInt(req.params.id);

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT patron_id, patron_name, email FROM patrons WHERE patron_id = ?',
            [patronId]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: 'Patron not found' });
            return;
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching patron:', error);
        res.status(500).json({ error: 'Failed to fetch patron' });
    }
};

// POST /api/auth/login - Authenticate patron
export const login = async (req: Request, res: Response): Promise<void> => {
    let body = req.body;
    if (Buffer.isBuffer(body)) {
        body = JSON.parse(body.toString());
    }
    const { email, password } = body;

    try {


        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT patron_id, patron_name, email, password FROM patrons WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const patron = rows[0];

        // Plain text comparison (consider hashing later)
        if (patron.password !== password) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Don't send password back
        const { password: _, ...patronWithoutPassword } = patron;

        res.json({
            success: true,
            patron: patronWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// POST /api/notify-service - Ring the bell endpoint
export const notifyService = async (req: Request, res: Response): Promise<void> => {
    let body = req.body;
    if (Buffer.isBuffer(body)) {
        body = JSON.parse(body.toString());
    }
    const { patron_id, table_id } = body;
    try {

        if (!patron_id) {
            res.status(400).json({ error: 'patron_id is required' });
            return;
        }

        // Verify patron exists
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT patron_id FROM patrons WHERE patron_id = ?',
            [patron_id]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: 'Patron not found' });
            return;
        }

        // Log the notification (expand later for actual staff notification)
        console.log(`🔔 SERVICE NOTIFICATION - Patron ID: ${patron_id}, Table: ${table_id || 'Not specified'}, Time: ${new Date().toISOString()}`);

        res.json({
            success: true,
            message: 'Service notified',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ error: 'Failed to notify service' });
    }
};