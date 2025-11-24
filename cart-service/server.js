import express from 'express';
import cors from 'cors';
import rutasCart from './routes/cart.routes.js';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Montamos TODAS las rutas del carrito bajo el prefijo /cart
app.use('/cart', rutasCart);

app.listen(PORT, () => {
    console.log(`Servicio de Carrito corriendo en el puerto ${PORT}`);
});