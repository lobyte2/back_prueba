import express from 'express';
import cors from 'cors';
import rutasProducto from './routes/product.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Todas las rutas de productos viven bajo /products
app.use('/products', rutasProducto);

app.listen(PORT, () => {
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
});
