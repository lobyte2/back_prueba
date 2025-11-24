import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
app.use(cors());
app.use(express.json());

// Leer puerto de Render (o usar 3000 localmente)
const PORT = process.env.PORT || 3000;

// Endpoint de Estado (Health Check)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor Gateway funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// --- RUTAS A MICROSERVICIOS ---
// Usamos variables de entorno para Producción, o localhost para Desarrollo

const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('--- Configuración de Rutas ---');
console.log(`Products -> ${productsUrl}`);
console.log(`Login    -> ${loginUrl}`);
console.log(`Users    -> ${usersUrl}`);
console.log(`Cart     -> ${cartUrl}`);
console.log(`Blog     -> ${blogUrl}`);

// Redirecciones (Proxies)
app.use('/api/products', proxy(productsUrl));
app.use('/api/login', proxy(loginUrl));
app.use('/api/users', proxy(usersUrl));
app.use('/api/cart', proxy(cartUrl));
app.use('/api/blog', proxy(blogUrl));

app.listen(PORT, () => {
    console.log(`API Gateway corriendo en puerto ${PORT}`);
});