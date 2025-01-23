import express from 'express';
import { testHealth } from '../controllers/testController';

const router = express.Router();

router.get('/health', testHealth);

export default router;