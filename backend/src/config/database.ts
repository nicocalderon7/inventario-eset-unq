import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Obtenemos la URL de la variable de entorno
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('La variable DATABASE_URL no está configurada en el .env');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Para que la consola esté limpia
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Esto es obligatorio para conectar con Railway desde afuera
    }
  }
});

export default sequelize;