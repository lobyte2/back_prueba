import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de Estado (Health Check)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor Gateway funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Redirigimos cada petición al microservicio correcto
app.use('/api/products', proxy('http://localhost:3001')); // Al servicio de Productos
app.use('/api/login', proxy('http://localhost:3002'));    // Al servicio de Login
app.use('/api/users', proxy('http://localhost:3003'));    // Al servicio de Users (Admin)
app.use('/api/cart', proxy('http://localhost:3004'));     // Al servicio de Carrito
app.use('/api/blog', proxy('http://localhost:3005'));     // Al servicio de Blog

app.listen(3000, () => {
    console.log('API Gateway corriendo en http://localhost:3000');
});