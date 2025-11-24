import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => res.json({ status: 'OK' }));

// URLs de los microservicios (desde variables de entorno o localhost)
const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('Rutas configuradas:', { productsUrl, loginUrl, usersUrl, cartUrl, blogUrl });

// --- CONFIGURACIÓN DE PROXIES ---

// Helper para limpiar la URL: elimina el prefijo "/api/algo"
// Si llega "/api/products", enviamos "/" al microservicio
// Si llega "/api/products/123", enviamos "/123" al microservicio
const stripPrefix = (prefix) => (req) => {
    const newPath = req.url.replace(prefix, '') || '/';
    console.log(`Redirigiendo ${req.url} -> ${newPath}`); // Log para depurar
    return newPath;
};

// 1. PRODUCTOS
// El microservicio espera "/" para listar productos
app.use('/api/products', proxy(productsUrl, {
    proxyReqPathResolver: (req) => {
        // req.url aquí ya viene sin el prefijo base del app.use si se usa router,
        // pero con app.use('/api/products', proxy...) express-http-proxy a veces necesita ayuda.
        // La forma más segura es reconstruir la ruta.

        // Opción A: Usar req.url directamente si Express ya cortó el prefijo (funciona en algunos setups)
        // Opción B: Usar req.originalUrl y cortar manualmente (más seguro)

        let parts = req.originalUrl.split('?');
        let queryString = parts[1] ? '?' + parts[1] : '';
        let path = parts[0].replace('/api/products', '');
        return (path || '/') + queryString;
    }
}));

// 2. LOGIN
// Si el microservicio espera "/login", entonces NO debemos quitar el prefijo, o ajustarlo.
// Revisa si tu login-service tiene `app.use('/login', ...)` o `app.use('/', ...)`
// Asumiendo que sigue el mismo patrón que products (app.use('/', ...)):
app.use('/api/login', proxy(loginUrl, {
    proxyReqPathResolver: (req) => {
        let parts = req.originalUrl.split('?');
        let queryString = parts[1] ? '?' + parts[1] : '';
        let path = parts[0].replace('/api/login', '');
        // Si tu microservicio de login espera "/login" internamente (ej: router.post('/login')),
        // entonces descomenta la siguiente línea:
        // path = '/login' + path;
        return (path || '/') + queryString;
    }
}));

// 3. USERS (Igual que products)
app.use('/api/users', proxy(usersUrl, {
    proxyReqPathResolver: (req) => {
        let parts = req.originalUrl.split('?');
        let queryString = parts[1] ? '?' + parts[1] : '';
        let path = parts[0].replace('/api/users', '');
        return (path || '/') + queryString;
    }
}));

// 4. CART (Igual que products)
app.use('/api/cart', proxy(cartUrl, {
    proxyReqPathResolver: (req) => {
        let parts = req.originalUrl.split('?');
        let queryString = parts[1] ? '?' + parts[1] : '';
        let path = parts[0].replace('/api/cart', '');
        return (path || '/') + queryString;
    }
}));

// 5. BLOG (Igual que products)
app.use('/api/blog', proxy(blogUrl, {
    proxyReqPathResolver: (req) => {
        let parts = req.originalUrl.split('?');
        let queryString = parts[1] ? '?' + parts[1] : '';
        let path = parts[0].replace('/api/blog', '');
        return (path || '/') + queryString;
    }
}));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});