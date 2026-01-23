import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Equipo from './Equipo.js';

class Mantenimiento extends Model {}

Mantenimiento.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_equipo: { 
    type: DataTypes.INTEGER, 
    references: { model: Equipo, key: 'id' } 
  },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE },
  repuestos: { type: DataTypes.TEXT },
  descripcion_falla: { type: DataTypes.STRING, allowNull: false },
  responsable: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.ENUM('en_progreso', 'completado', 'pendiente'), allowNull: false },
  observaciones: { type: DataTypes.TEXT }
}, {
  sequelize,
  tableName: 'mantenimientos',
  underscored: true,
});

// Relación: Un equipo tiene muchos mantenimientos
Equipo.hasMany(Mantenimiento, { foreignKey: 'id_equipo' });
Mantenimiento.belongsTo(Equipo, { foreignKey: 'id_equipo' });

export default Mantenimiento;