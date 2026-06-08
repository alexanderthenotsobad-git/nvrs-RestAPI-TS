import { Router, Request, Response } from 'express';

const router = Router();

// Redirect /app to your Cloud Run frontend
router.get('/app', (req: Request, res: Response) => {
    res.redirect(302, 'https://nvrs-frontend-dev-536838566831.us-central1.run.app');
});

export default router;