import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js'; 
import './models/Usuario.js';
import './models/Categoria.js';
import './models/Prestamo.js';
import './models/Equipo.js';
import './models/Mantenimiento.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import prestamoRoutes from './routes/prestamoRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);

// Función para conectar a la base de datos
const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL en Railway exitosa.');
    
    await sequelize.sync({ force: false });
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
};

// Rutas
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: "Servidor de Inventario UNQ - API Activa",
        status: "OK",
        timestamp: new Date()
    });
});

// Iniciar servidor y probar DB
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    await conectarDB();
});