import express from 'express';
import cors from 'cors';
import rutasLogin from './routes/login.routes.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// TODAS las rutas del login quedan bajo /login
app.use('/login', rutasLogin);

app.listen(PORT, () => {
    console.log(`Servicio de Login corriendo en el puerto ${PORT}`);
});
