import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();

// Configuración de CORS para permitir todas las conexiones (Frontend <-> Gateway)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => res.json({ status: 'OK', message: 'Gateway Online' }));

// URLs de los microservicios (desde variables de entorno)
const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('--- Gateway Iniciado ---');

// Función para reescribir la ruta: elimina el prefijo '/api'
// Ejemplo: /api/products/1 -> /products/1
const rewritePath = (req) => {
    // req.originalUrl contiene la ruta completa que llegó (ej. /api/products/1)
    // El ^\/api asegura que solo se remueva si está al inicio.
    const newPath = req.originalUrl.replace(/^\/api/, '');
    console.log(`[Proxy Rewrite] ${req.originalUrl} -> ${newPath}`);
    return newPath;
};

// Opciones estándar para todos los proxies
const proxyOptions = () => ({
    https: true,
    // CRÍTICO: Solución nativa de proxy que arregla el Host Header en Render
    changeOrigin: true,

    // Usamos la reescritura explícita
    proxyReqPathResolver: rewritePath,

    // Manejo de errores
    proxyErrorHandler: (err, res, next) => {
        console.error('[Proxy Error]', err);
        if (!res.headersSent) {
            res.status(500).json({ status: 'Error', message: 'Error en la conexión del microservicio.' });
        }
    }
});


// 1. PRODUCTOS: /api/products -> /products
// Tu microservicio de productos espera la ruta /products
app.use('/api/products', proxy(productsUrl, proxyOptions(productsUrl)));

// 2. LOGIN: /api/login -> /login
app.use('/api/login', proxy(loginUrl, proxyOptions(loginUrl)));

// 3. USERS: /api/users -> /users
app.use('/api/users', proxy(usersUrl, proxyOptions(usersUrl)));

// 4. CART: /api/cart -> /cart
app.use('/api/cart', proxy(cartUrl, proxyOptions(cartUrl)));

// 5. BLOG: /api/blog -> /blog
app.use('/api/blog', proxy(blogUrl, proxyOptions(blogUrl)));


app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});