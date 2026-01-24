import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {
  // Declaramos los campos para que TypeScript los reconozca
  public id!: number;
  public nombre!: string;
  public apellido!: string;
  public password!: string;
  public rol!: 'admin' | 'user'; 
  public email!: string;
  public area?: string;

  // Los campos de tiempo de tu DER
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Usuario.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('admin', 'user'), allowNull: false }, 
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  area: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  tableName: 'usuarios',
  underscored: true,
  timestamps: true, // Esto activa el created_at y updated_at del DER
});

export default Usuario;