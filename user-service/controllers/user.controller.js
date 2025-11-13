// Capa de Controlador: Maneja las peticiones HTTP (req, res).
import * as servicioUsuario from '../services/user.service.js';

export const obtenerTodosLosUsuarios = (req, res) => {
    res.json(servicioUsuario.obtenerTodos());
};

export const crearUsuario = (req, res) => {
    try {
        const listaActualizada = servicioUsuario.crear(req.body);
        res.status(201).json(listaActualizada);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const eliminarUsuario = (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const listaActualizada = servicioUsuario.eliminarPorId(usuarioId);
    res.json(listaActualizada);
};