const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// === CONFIGURACIÓN DE URLS DE MICROSERVICIOS ===
// ¡Asegúrate de que estas URLS coincidan con tus despliegues en Render!

const USER_SERVICE_URL = 'https://back-user-3q47.onrender.com/';
const LOGIN_SERVICE_URL = 'https://back-login-dvr8.onrender.com/';
const PRODUCT_SERVICE_URL = 'https://back-product-vv5t.onrender.com/';
const CART_SERVICE_URL = 'https://back-cart-n1xz.onrender.com/';
const BLOG_SERVICE_URL = 'https://back-blog-zxmt.onrender.com/';

// Configuración CORS
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier origen (ajusta esto en producción)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Middleware para JSON
app.use(express.json());

// Log de peticiones
app.use((req, res, next) => {
    console.log(`[GATEWAY] Petición recibida: ${req.method} ${req.path}`);
    next();
});

// === CONFIGURACIÓN DE PROXIES (Solución a 404) ===

// Proxy para Login Service (rutas: /api/login/login, /api/login/register)
app.use('/api/login', createProxyMiddleware({
    target: LOGIN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/login': '/', // El microservicio Login recibe la ruta limpia
    },
    onError: (err, req, res) => {
        console.error('Error de proxy al Login Service:', err);
        res.status(503).json({ message: 'Login Service no disponible' });
    }
}));


// PROXY PARA USER SERVICE (Soluciona el 404 en /api/users)
// Redirige /api/users/* a la URL base del servicio de usuarios
app.use('/api/users', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    // Reescribe la ruta para que el microservicio solo vea la parte después de /users
    pathRewrite: {
        '^/api/users': '/', // Mapea /api/users a / (listar usuarios o agregar)
        '^/api/users/(\\w+)': '/$1' // Mapea /api/users/123 a /123 (obtener/eliminar por ID)
    },
    onError: (err, req, res) => {
        console.error('Error de proxy al User Service:', err);
        res.status(503).json({ message: 'User Service no disponible' });
    }
}));


// Proxy para Product Service
app.use('/api/products', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': '/',
        '^/api/products/(\\w+)': '/$1'
    },
    onError: (err, req, res) => {
        console.error('Error de proxy al Product Service:', err);
        res.status(503).json({ message: 'Product Service no disponible' });
    }
}));


// Proxy para Cart Service
app.use('/api/cart', createProxyMiddleware({
    target: CART_SERVICE_URL,
    changeOrigin: true,
    // Esta regla cubre rutas como /api/cart/items y /api/cart/checkout
    pathRewrite: {
        '^/api/cart': '/',
    },
    onError: (err, req, res) => {
        console.error('Error de proxy al Cart Service:', err);
        res.status(503).json({ message: 'Cart Service no disponible' });
    }
}));


// Proxy para Blog Service
app.use('/api/blog', createProxyMiddleware({
    target: BLOG_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/blog': '/',
    },
    onError: (err, req, res) => {
        console.error('Error de proxy al Blog Service:', err);
        res.status(503).json({ message: 'Blog Service no disponible' });
    }
}));


// Ruta de salud/ping para Render
app.get('/', (req, res) => {
    res.send('Gateway iniciado y funcionando. Use /api/...');
});


app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});