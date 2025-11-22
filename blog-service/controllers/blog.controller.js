import * as servicioBlog from '../services/blog.service.js';

export const obtenerTodosLosPosteos = async (req, res) => {
    try {
        const todosLosPosteos = await servicioBlog.obtenerTodos();
        res.json(todosLosPosteos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el blog' });
    }
};