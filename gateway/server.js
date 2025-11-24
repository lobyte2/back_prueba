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

// 1. PRODUCTOS
// Si llega "/api/products", enviamos "/products" al microservicio
app.use('/api/products', proxy(productsUrl, {
    proxyReqPathResolver: (req) => {
        // req.url aquí es lo que sigue a /api/products. Ej: "/" o "/123"
        // Forzamos que empiece con /products
        return `/products${req.url === '/' ? '' : req.url}`;
    }
}));

// 2. LOGIN
// Si llega "/api/login", enviamos "/login" al microservicio
app.use('/api/login', proxy(loginUrl, {
    proxyReqPathResolver: (req) => {
        return `/login${req.url === '/' ? '' : req.url}`;
    }
}));

// 3. USERS
// Si llega "/api/users", enviamos "/users" al microservicio
app.use('/api/users', proxy(usersUrl, {
    proxyReqPathResolver: (req) => {
        return `/users${req.url === '/' ? '' : req.url}`;
    }
}));

// 4. CART
// Si llega "/api/cart", enviamos "/cart" al microservicio
app.use('/api/cart', proxy(cartUrl, {
    proxyReqPathResolver: (req) => {
        return `/cart${req.url === '/' ? '' : req.url}`;
    }
}));

// 5. BLOG
// Si llega "/api/blog", enviamos "/blog" al microservicio
// OJO: Si tu servicio de blog usa "/blog/posteos", aquí se enviará "/blog/posteos"
app.use('/api/blog', proxy(blogUrl, {
    proxyReqPathResolver: (req) => {
        return `/blog${req.url === '/' ? '' : req.url}`;
    }
}));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});