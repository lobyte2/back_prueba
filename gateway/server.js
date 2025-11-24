
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

// Función para reescribir la ruta quitando SÓLO el prefijo '/api'
// Ejemplo: /api/products -> /products
// Ejemplo: /api/login/login -> /login/login
const rewritePath = (req) => {
    // Usamos req.originalUrl porque es la URL completa que llegó al Gateway
    const newPath = req.originalUrl.replace(/^\/api/, '');
    console.log(`[Proxy Rewrite] ${req.originalUrl} -> ${newPath}`);
    return newPath;
};

// Opciones estándar para todos los proxies
const proxyOptions = (targetUrl) => ({
    https: true,
    // Aseguramos que el Host Header sea el correcto (crucial para Render)
    proxyReqOptDecorator: (proxyReqOpts) => {
        const target = new URL(targetUrl);
        proxyReqOpts.headers['host'] = target.host;
        return proxyReqOpts;
    },
    // La reescritura es la misma para todos: quitamos /api
    proxyReqPathResolver: rewritePath,
    proxyErrorHandler: (err, res, next) => {
        console.error('[Proxy Error]', err);
        next(err);
    }
});


// 1. PRODUCTOS: /api/products -> /products (en el microservicio)
app.use('/api/products', proxy(productsUrl, proxyOptions(productsUrl)));

// 2. LOGIN: /api/login/login -> /login/login
app.use('/api/login', proxy(loginUrl, proxyOptions(loginUrl)));

// 3. USERS: /api/users -> /users
app.use('/api/users', proxy(usersUrl, proxyOptions(usersUrl)));

// 4. CART: /api/cart -> /cart
app.use('/api/cart', proxy(cartUrl, proxyOptions(cartUrl)));

// 5. BLOG: /api/blog/posteos -> /blog/posteos
app.use('/api/blog', proxy(blogUrl, proxyOptions(blogUrl)));


app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});