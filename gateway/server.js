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

// EXPLICACIÓN DE LA SOLUCIÓN:
// Cuando usas app.use('/api/products', ...), Express automáticamente corta
// esa parte de la URL. La variable 'req.url' pasa a ser solo lo que queda.
// Ejemplo:
//   Petición navegador: /api/products
//   Llega al proxy como: /
//   Microservicio recibe: /  (¡Justo lo que tu router espera!)

app.use('/api/products', proxy(productsUrl));
app.use('/api/login', proxy(loginUrl));
app.use('/api/users', proxy(usersUrl));
app.use('/api/cart', proxy(cartUrl));
app.use('/api/blog', proxy(blogUrl));

app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});