import express from 'express';
import cors from 'cors';
import rutasUsuario from './routes/user.routes.js';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Rutas relativas a /api/users (definido en el Gateway)
app.use('/', rutasUsuario);

app.listen(PORT, () => {
    console.log(`Servicio de Usuarios (Admin) corriendo en http://localhost:${PORT}`);
});