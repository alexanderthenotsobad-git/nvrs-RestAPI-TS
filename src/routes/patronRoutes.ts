import express from 'express';
import {
    getAllPatrons,
    getPatronById,
    login,
    notifyService
} from '../controllers/patronController';

const router = express.Router();

// GET /api/patrons - List all patrons
router.get('/patrons', getAllPatrons);

// GET /api/patrons/:id - Get single patron by ID
router.get('/patrons/:id', getPatronById);

// POST /api/auth/login - Authenticate patron
router.post('/auth/login', login);

// POST /api/notify-service - Ring the bell endpoint
router.post('/notify-service', notifyService);

export default router;