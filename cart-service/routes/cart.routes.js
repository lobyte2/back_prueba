import { Router } from 'express';
// Antes: import { obtenerCarritoUsuario, agregarItemAlCarrito, eliminarItemDelCarrito, checkout } from '../controllers/cart.controller.js';
// Después:
import * as cartController from '../controllers/cart.controller.js';

const router = Router();

// Rutas del carrito (no cambiar endpoints)
router.get('/', cartController.obtenerCarritoUsuario);
router.post('/itemlo', cartController.agregarItemAlCarrito);
router.delete('/itemlo/:id', cartController.eliminarItemDelCarrito);
router.post('/checkout', cartController.checkout);

export default router;
