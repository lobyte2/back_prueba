import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();

// Configuración CORS permisiva para evitar bloqueos entre Frontend y Gateway
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Endpoint de Estado
app.get('/api/status', (req, res) => res.json({ status: 'OK', message: 'Gateway Online' }));

// URLs de los microservicios
const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('--- Gateway Iniciado ---');
console.log(`Products -> ${productsUrl}`);

// Middleware de Logs
app.use((req, res, next) => {
    console.log(`[Gateway] ${req.method} ${req.url}`);
    next();
});

// --- PROXIES ---

// Helper para limpiar rutas
// Si llega /api/products -> envía /
// Si llega /api/products/123 -> envía /123
const proxyOptions = {
    proxyReqPathResolver: (req) => {
        // Eliminamos el prefijo '/api/products' (o el que corresponda) de la URL original
        // Esto es más seguro que usar req.url directamente a veces
        // Pero dado que tu microservicio espera "/", lo más simple es:
        let path = req.url === '/' ? '' : req.url;
        console.log(`[Proxy] Redirigiendo a: ${path || '/'}`);
        return path || '/';
    },
    // IMPORTANTE: Esto evita problemas de host en Render
    // Le dice al destino que la petición viene "como si fuera local" para él
    // (Opcional pero recomendado en proxies)
    // userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => { ... }
};

// 1. PRODUCTOS
app.use('/api/products', proxy(productsUrl, {
    ...proxyOptions,
    https: true // Forzar HTTPS si las URLs de Render son https
}));

// 2. LOGIN
app.use('/api/login', proxy(loginUrl, {
    ...proxyOptions,
    https: true
}));

// 3. USERS
app.use('/api/users', proxy(usersUrl, {
    ...proxyOptions,
    https: true
}));

// 4. CART
app.use('/api/cart', proxy(cartUrl, {
    ...proxyOptions,
    https: true
}));

// 5. BLOG
// OJO: Si blog-service espera /blog/posteos y el gateway recibe /api/blog/posteos
// Con esta lógica enviará /posteos. Asegúrate de que blog-service tenga ruta /posteos o ajuste aquí.
app.use('/api/blog', proxy(blogUrl, {
    ...proxyOptions,
    https: true
}));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});