import express from 'express';
import cors from 'cors';
import rutasBlog from './routes/blog.routes.js';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Montamos rutas bajo /blog  ✔ CORRECTO
app.use('/blog', rutasBlog);

app.listen(PORT, () => {
    console.log(`Servicio de Blog corriendo en el puerto ${PORT}`);
});
