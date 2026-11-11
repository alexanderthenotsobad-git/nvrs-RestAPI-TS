import express from 'express';
import {
    getAllPatrons,
    getPatronById,
    login,
    notifyService
} from '../controllers/patronController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patrons
 *   description: Patron accounts, login, and table service requests
 */

/**
 * @swagger
 * /api/patrons:
 *   get:
 *     tags:
 *       - Patrons
 *     summary: List all patrons
 *     description: Returns every patron without password fields.
 *     responses:
 *       200:
 *         description: A list of patrons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patron'
 *       500:
 *         description: Failed to fetch patrons
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/patrons', getAllPatrons);

/**
 * @swagger
 * /api/patrons/{id}:
 *   get:
 *     tags:
 *       - Patrons
 *     summary: Get a single patron by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patron ID
 *     responses:
 *       200:
 *         description: The patron
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patron'
 *       404:
 *         description: Patron not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch patron
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/patrons/:id', getPatronById);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Patrons
 *     summary: Authenticate a patron
 *     description: >
 *       Returns the patron record on success. No token is issued: the session is
 *       identified by patron_id thereafter, and no endpoint currently requires an
 *       Authorization header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 patron:
 *                   $ref: '#/components/schemas/Patron'
 *       400:
 *         description: Email and password required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/login', login);

/**
 * @swagger
 * /api/notify-service:
 *   post:
 *     tags:
 *       - Patrons
 *     summary: Request table service ("ring the bell")
 *     description: >
 *       Validates that the patron exists, then logs a service notification. The
 *       staff-facing delivery mechanism is not implemented yet; the call currently
 *       succeeds without notifying anyone.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patron_id]
 *             properties:
 *               patron_id:
 *                 type: integer
 *               table_id:
 *                 type: integer
 *                 description: Optional table number
 *     responses:
 *       200:
 *         description: Notification accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Service notified
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: patron_id is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Patron not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to notify service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/notify-service', notifyService);

export default router;
