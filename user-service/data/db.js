// Base de datos en memoria de usuarios.
// En un sistema real, esta data vendría de la *misma* DB que usa login-service.
let usuarios = [
    { id: 1, email: 'roro@duoc.cl', password: 'admin', role: 'admin', fullName: 'Admin Roro', phone: 'N/A', region: 'N/A' },
    { id: 2, email: 'user@test.com', password: 'user123', role: 'user', fullName: 'Usuario Test', phone: '987654321', region: 'Los Lagos' },
];
export default usuarios;