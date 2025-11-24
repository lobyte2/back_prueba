import { Router } from 'express';
import {
    obtenerTodosLosUsuarios,
    crearUsuario,
    eliminarUsuario
} from '../controllers/user.controller.js';

const router = Router();

router.get('/', obtenerTodosLosUsuarios);
router.post('/', crearUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
