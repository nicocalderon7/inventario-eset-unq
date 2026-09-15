import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Equipo from './Equipo.js';

class Mantenimiento extends Model {}

Mantenimiento.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_equipo: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Equipo, key: 'id' } 
  },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE },
  repuestos: { type: DataTypes.STRING(255) },
  descripcion_falla: { type: DataTypes.TEXT, allowNull: false },
  responsable: { type: DataTypes.STRING, allowNull: true },
  estado: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pendiente', validate: { isIn: [['en_progreso', 'completado', 'pendiente']] } },
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
