import express from 'express';
import { createMenuItem } from '../controllers/menuTestController';

const router = express.Router();
router.post('/create', createMenuItem);
export default router;
