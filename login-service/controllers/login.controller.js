import * as servicioLogin from '../services/login.service.js';

export const manejarLogin = async (req, res) => {
    try {
        const sesionUsuario = await servicioLogin.autenticar(req.body);
        res.json(sesionUsuario);
    } catch (error) {
        res.status(401).json(error.message);
    }
};

export const manejarRegistro = async (req, res) => {
    try {
        const nuevaSesion = await servicioLogin.registrar(req.body);
        res.status(201).json(nuevaSesion);
    } catch (error) {
        res.status(400).json(error.message);
    }
};