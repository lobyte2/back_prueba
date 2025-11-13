// Capa de Servicio: Lógica de negocio para admin de usuarios.
import usuarios from '../data/db.js';

export const obtenerTodos = () => {
    return usuarios;
};

export const crear = ({ email, password }) => {
    if (!password || password.length < 5 || password.length > 15) {
        throw new Error('La contraseña debe tener entre 5 y 15 caracteres');
    }
    if (usuarios.some(u => u.email === email)) {
        throw new Error('El correo ya existe');
    }

    const nuevoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        email, password, role: 'user', fullName: 'Nuevo Usuario (Admin)',
        phone: 'N/A', region: 'N/A'
    };

    usuarios.push(nuevoUsuario);
    return usuarios;
};

export const eliminarPorId = (usuarioId) => {
    // Nota: Faltaría validar que un admin no se borre a sí mismo.
    // Esto requeriría autenticación en este microservicio.
    let usuariosFiltrados = usuarios.filter(u => u.id !== usuarioId);
    usuarios = usuariosFiltrados;
    return usuarios;
};