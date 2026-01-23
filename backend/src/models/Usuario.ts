import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {}

Usuario.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('admin', 'user'), allowNull: false }, // Ajustar según tus enums del DER
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  area: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  tableName: 'usuarios',
  underscored: true,
});

export default Usuario;