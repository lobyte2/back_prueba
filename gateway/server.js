import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => res.json({ status: 'OK' }));

const productsUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const loginUrl = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const usersUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const blogUrl = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

// Función helper para limpiar la URL
// Si llega "/api/products", le enviamos "/products" al microservicio
const pathRewrite = (prefix) => (req) => {
    return req.originalUrl.replace(prefix, '');
};

// IMPORTANTE: Aquí ajustamos según cómo hayas programado tus microservicios.
// Si tus microservicios esperan recibir "/products", "/cart", etc. NO uses el replace.
// Si tus microservicios esperan recibir "/" (la raíz), SÍ usa el replace.

// Voy a asumir que en tus microservicios tienes algo como `app.use('/products', routes)`.
// En ese caso, NO debemos quitar "/products".
// Pero SÍ debemos quitar "/api" si no existe en el microservicio.

// Intenta esta configuración estándar primero (pasa la URL tal cual pero sin /api si es redundante):

app.use('/api/products', proxy(productsUrl));
app.use('/api/login', proxy(loginUrl));
app.use('/api/users', proxy(usersUrl));
app.use('/api/cart', proxy(cartUrl));
app.use('/api/blog', proxy(blogUrl));

// Si esto sigue dando 404, significa que tus microservicios NO tienen el prefijo /api.
// Entonces el Gateway recibe /api/products, y le manda /api/products al microservicio.
// Y el microservicio dice "No tengo /api/products", tengo "/products".

// PRUEBA B (Recomendada si la anterior falló): Quitar "/api"
/*
app.use('/api/products', proxy(productsUrl, {
    proxyReqPathResolver: (req) => {
        // Transforma /api/products -> /products
        return req.originalUrl.replace('/api', '');
    }
}));
// Repetir para los otros...
*/

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});