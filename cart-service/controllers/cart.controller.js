import * as servicioCarrito from '../services/cart.service.js';

const obtenerUsuarioId = (req) => {
    const userId = req.headers['x-user-id'];
    if (!userId) throw new Error('Usuario no autenticado. Se requiere header x-user-id.');
    return userId;
};

export const obtenerCarritoUsuario = async (req, res) => {
    try { res.json(await servicioCarrito.obtenerCarrito(obtenerUsuarioId(req))); }
    catch (error) { res.status(401).json({ message: error.message }); }
};

export const agregarItemAlCarrito = async (req, res) => {
    try { res.json(await servicioCarrito.agregarItem(obtenerUsuarioId(req), req.body)); }
    catch (error) { res.status(500).json({ message: error.message }); }
};

export const eliminarItemDelCarrito = async (req, res) => {
    try { res.json(await servicioCarrito.eliminarItem(obtenerUsuarioId(req), req.params.id)); }
    catch (error) { res.status(500).json({ message: error.message }); }
};

export const checkout = async (req, res) => {
    try {
        const userId = obtenerUsuarioId(req);
        const carritoVacio = await servicioCarrito.vaciarCarrito(userId);
        res.json({ message: 'Compra realizada', cart: carritoVacio });
    } catch (error) { res.status(500).json({ message: error.message }); }
};