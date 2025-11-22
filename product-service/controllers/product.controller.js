import * as servicioProducto from '../services/product.service.js';

export const obtenerTodosLosProductos = async (req, res) => {
    try {
        const todosLosProductos = await servicioProducto.obtenerTodos();
        res.json(todosLosProductos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await servicioProducto.obtenerPorId(req.params.id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await servicioProducto.crear(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await servicioProducto.actualizar(req.params.id, req.body);
        if (productoActualizado) {
            res.json(productoActualizado);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await servicioProducto.eliminar(req.params.id);
        if (productoEliminado) {
            res.json({ message: 'Producto eliminado con éxito', producto: productoEliminado });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};