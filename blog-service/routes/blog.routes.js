import { Router } from 'express';
import { obtenerTodosLosPosteos } from '../controllers/blog.controller.js';

const router = Router();

// GET /blog/posteos
router.get('/posteos', obtenerTodosLosPosteos);

export default router;
