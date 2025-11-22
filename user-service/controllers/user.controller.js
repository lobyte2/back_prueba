import * as servicioUsuario from '../services/user.service.js';

export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await servicioUsuario.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const listaActualizada = await servicioUsuario.crear(req.body);
        res.status(201).json(listaActualizada);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const listaActualizada = await servicioUsuario.eliminarPorId(req.params.id);
        res.json(listaActualizada);
    } catch (error) {
        res.status(500).json(error.message);
    }
};