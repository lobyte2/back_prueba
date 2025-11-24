import express from 'express';
import cors from 'cors';
import rutasLogin from './routes/login.routes.js'; // Asumo que el archivo de rutas es este

const app = express();
// USO CORRECTO DEL PUERTO EN RENDER
const PORT = process.env.PORT || 3002;

app.use(cors({
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Montamos TODAS las rutas de login bajo el prefijo /login
app.use('/login', rutasLogin); // <--- AHORA ESPERA /login

app.listen(PORT, () => {
    console.log(`Servicio de Login corriendo en el puerto ${PORT}`);
});