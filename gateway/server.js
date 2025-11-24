import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => res.json({ status: 'OK', message: 'Gateway Online' }));

// URLs de los microservicios
const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('--- Gateway Iniciado ---');
console.log(`Products URL: ${productsUrl}`);

// Middleware de Logs
app.use((req, res, next) => {
    console.log(`[Gateway IN] ${req.method} ${req.url}`);
    next();
});

// --- HELPER PARA OPCIONES DE PROXY ---
// Esta función crea la configuración exacta para evitar el error 404 en Render
const createProxyOptions = (targetUrl) => {
    return {
        https: true, // Vital para Render
        // 1. REESCRITURA DE RUTA: Quitamos /api/x y dejamos solo /
        proxyReqPathResolver: (req) => {
            const path = req.url === '/' ? '' : req.url;
            console.log(`[Proxy] ${targetUrl}${path || '/'}`);
            return path || '/';
        },
        // 2. CORRECCIÓN DE CABECERA HOST (La solución al 404)
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            // Le decimos a Render: "Voy a hablar con el servicio de productos"
            // en lugar de "Vengo del gateway".
            try {
                const target = new URL(targetUrl);
                proxyReqOpts.headers['host'] = target.host;
            } catch (e) {
                console.error('Error parseando URL para Host header', e);
            }
            return proxyReqOpts;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error(`[Proxy Error] ${targetUrl}`, err);
            next(err);
        }
    };
};

// --- RUTAS PROXY ---

app.use('/api/products', proxy(productsUrl, createProxyOptions(productsUrl)));
app.use('/api/login', proxy(loginUrl, createProxyOptions(loginUrl)));
app.use('/api/users', proxy(usersUrl, createProxyOptions(usersUrl)));
app.use('/api/cart', proxy(cartUrl, createProxyOptions(cartUrl)));
app.use('/api/blog', proxy(blogUrl, createProxyOptions(blogUrl)));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});