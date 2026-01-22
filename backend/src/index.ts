import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta inicial de prueba
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: "Servidor de Inventario UNQ - API Activa",
        status: "OK",
        timestamp: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});