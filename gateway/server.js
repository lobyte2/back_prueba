import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => res.json({ status: 'OK' }));

const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
// ... otras URLs ... (déjalas como estaban)
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

console.log('--- Gateway Iniciado ---');
console.log('URL Productos:', productsUrl);

// Middleware para loguear TODAS las peticiones que llegan
app.use((req, res, next) => {
    console.log(`[Gateway] Recibida petición: ${req.method} ${req.url}`);
    next();
});

// Proxy de Productos con LOGS
app.use('/api/products', proxy(productsUrl, {
    proxyReqPathResolver: (req) => {
        // Logueamos qué vamos a pedirle al microservicio
        const targetPath = req.url === '/' ? '' : req.url; // O simplemente req.url si el servicio espera /
        console.log(`[Proxy Products] Redirigiendo a: ${productsUrl}${targetPath || '/'}`);
        return targetPath || '/';
    },
    proxyErrorHandler: function(err, res, next) {
        console.error('[Proxy Error] Fallo al conectar con productos:', err);
        next(err);
    }
}));

// ... (Resto de proxies para login, cart, etc. igual que antes) ...
app.use('/api/cart', proxy(cartUrl, {
    proxyReqPathResolver: (req) => { return req.url === '/' ? '' : req.url; }
}));
app.use('/api/blog', proxy(blogUrl, {
    proxyReqPathResolver: (req) => { return req.url === '/' ? '' : req.url; }
}));


app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});