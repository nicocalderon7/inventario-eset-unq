import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js'; 

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Función para conectar a la base de datos
const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL en Railway exitosa.');
    
    // Sincronizar modelos (esto creará las tablas más adelante)
    // await sequelize.sync({ force: false }); 
    
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