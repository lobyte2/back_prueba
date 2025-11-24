import express from 'express';
import cors from 'cors';
import rutasProducto from './routes/product.routes.js';

const app = express();
// USO CORRECTO DEL PUERTO EN RENDER
const PORT = process.env.PORT || 3001; // Si no hay variable de Render, usa 3001 local

app.use(cors({
    origin: '*', // Permitir cualquier origen (para que Vercel y Render se hablen)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Montamos TODAS las rutas de productos bajo el prefijo /products
// CRÍTICO: Esto significa que en local/Render, este servicio espera peticiones a /products
app.use('/products', rutasProducto);

app.listen(PORT, () => {
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
});