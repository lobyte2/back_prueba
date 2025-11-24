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

// Middleware de Logs Global
app.use((req, res, next) => {
    console.log(`[Gateway IN] ${req.method} ${req.url}`);
    next();
});

// --- PROXIES ---

// Función para limpiar la URL de forma segura
// Esta función asegura que si llega "/api/products", se transforme en "/"
// Si llega "/api/products/123", se transforme en "/123"
const rewritePath = (req, prefix) => {
    // req.originalUrl siempre tiene la URL completa (/api/products/...)
    const currentUrl = req.originalUrl;

    // Si la URL es exactamente el prefijo o el prefijo con barra final
    if (currentUrl === prefix || currentUrl === prefix + '/') {
        return '/';
    }

    // Si es una sub-ruta (ej: /api/products/123), quitamos el prefijo
    if (currentUrl.startsWith(prefix)) {
        return currentUrl.replace(prefix, '');
    }

    // Fallback (no debería pasar si el app.use está bien configurado)
    return req.url;
};

// 1. PRODUCTOS
app.use('/api/products', proxy(productsUrl, {
    https: true, // Vital para Render -> Render
    proxyReqPathResolver: (req) => {
        const newPath = rewritePath(req, '/api/products');
        console.log(`[Proxy Products] ${req.originalUrl} -> ${productsUrl}${newPath}`);
        return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
        console.error('[Proxy Error Products]', err);
        next(err);
    }
}));

// 2. LOGIN
app.use('/api/login', proxy(loginUrl, {
    https: true,
    proxyReqPathResolver: (req) => {
        const newPath = rewritePath(req, '/api/login');
        console.log(`[Proxy Login] ${req.originalUrl} -> ${loginUrl}${newPath}`);
        return newPath;
    }
}));

// 3. USERS
app.use('/api/users', proxy(usersUrl, {
    https: true,
    proxyReqPathResolver: (req) => {
        const newPath = rewritePath(req, '/api/users');
        return newPath;
    }
}));

// 4. CART
app.use('/api/cart', proxy(cartUrl, {
    https: true,
    proxyReqPathResolver: (req) => {
        const newPath = rewritePath(req, '/api/cart');
        return newPath;
    }
}));

// 5. BLOG
app.use('/api/blog', proxy(blogUrl, {
    https: true,
    proxyReqPathResolver: (req) => {
        const newPath = rewritePath(req, '/api/blog');
        return newPath;
    }
}));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});