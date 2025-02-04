import express from 'express';
import { createMenuItem } from '../controllers/menuController';
import { deleteMenuItem } from '../controllers/menuController';

const router = express.Router();
router.post('/create', createMenuItem);
router.delete('/delete', deleteMenuItem);
export default router;
