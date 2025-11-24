import express from 'express';
import cors from 'cors';
import rutasBlog from './routes/blog.routes.js';

const app = express();
// USO CORRECTO DEL PUERTO EN RENDER
const PORT = process.env.PORT || 3005; // Usamos puerto dinámico

app.use(cors({
    origin: '*', // CRÍTICO: Permitir comunicación cruzada
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Montamos TODAS las rutas del blog bajo el prefijo /blog
app.use('/blog', rutasBlog);

app.listen(PORT, () => {
    console.log(`Servicio de Blog corriendo en el puerto ${PORT}`);
});