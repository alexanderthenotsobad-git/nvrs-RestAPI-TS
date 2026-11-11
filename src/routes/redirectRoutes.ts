import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Non-data routes (frontend entrypoint, docs)
 */

/**
 * @swagger
 * /app:
 *   get:
 *     tags:
 *       - System
 *     summary: Redirect to the NVRS web app
 *     description: >
 *       302 redirect to the currently deployed frontend on Cloud Run. The target is
 *       the dev Cloud Run service; update it when production is promoted.
 *     responses:
 *       302:
 *         description: Redirect to the frontend
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: Frontend URL
 */
router.get('/app', (req: Request, res: Response) => {
    res.redirect(302, 'https://nvrs-frontend-dev-536838566831.us-central1.run.app');
});

export default router;
