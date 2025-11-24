import express from 'express';
import cors from 'cors';
import rutasProducto from './routes/product.routes.js';

const app = express();
// CAMBIO IMPORTANTE: Usar process.env.PORT o 3001 si es local
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CAMBIO CRÍTICO: Montamos todas las rutas bajo el prefijo /products
app.use('/products', rutasProducto); // <--- AHORA ESPERA /products

app.listen(PORT, () => {
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
});