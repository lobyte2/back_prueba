import express from 'express';
import cors from 'cors';
import rutasUser from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Montamos TODAS las rutas de usuarios bajo el prefijo /users
app.use('/users', rutasUser);

app.listen(PORT, () => {
    console.log(`Servicio de Usuarios corriendo en el puerto ${PORT}`);
});