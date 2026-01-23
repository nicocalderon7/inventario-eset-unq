import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Equipo from './Equipo.js';

class Prestamo extends Model {}

Prestamo.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_usuario: { 
    type: DataTypes.INTEGER, 
    references: { model: Usuario, key: 'id' } 
  },
  id_equipo: { 
    type: DataTypes.INTEGER, 
    references: { model: Equipo, key: 'id' } 
  },
  id_responsable_entrega: { 
    type: DataTypes.INTEGER, 
    references: { model: Usuario, key: 'id' } 
  },
  fecha_solicitud: { type: DataTypes.DATE, allowNull: false },
  fecha_entrega: { type: DataTypes.DATE },
  fecha_devolucion: { type: DataTypes.DATE },
  estado: { type: DataTypes.ENUM('pendiente', 'entregado', 'devuelto', 'rechazado'), allowNull: false },
  observaciones: { type: DataTypes.TEXT },
  motivo_rechazo: { type: DataTypes.TEXT },
  observaciones_devolucion: { type: DataTypes.TEXT }
}, {
  sequelize,
  tableName: 'prestamos',
  underscored: true,
});

// Relaciones según tu DER
Usuario.hasMany(Prestamo, { foreignKey: 'id_usuario' });
Prestamo.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'solicitante' });

Equipo.hasMany(Prestamo, { foreignKey: 'id_equipo' });
Prestamo.belongsTo(Equipo, { foreignKey: 'id_equipo' });

// Relación con el responsable (apunta a la misma tabla usuarios)
Prestamo.belongsTo(Usuario, { foreignKey: 'id_responsable_entrega', as: 'responsable' });

export default Prestamo;