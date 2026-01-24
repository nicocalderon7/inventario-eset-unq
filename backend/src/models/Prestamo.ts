import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Equipo from './Equipo.js';

class Prestamo extends Model {
  public id!: number;
  public id_usuario!: number;
  public id_equipo!: number;
  public id_responsable_entrega?: number; // Opcional porque al principio puede ser NULL
  public fecha_solicitud!: Date;
  public fecha_entrega?: Date;
  public fecha_devolucion?: Date;
  public estado!: 'pendiente' | 'entregado' | 'devuelto' | 'rechazado';
  public observaciones?: string;
  public motivo_rechazo?: string;
  public observaciones_devolucion?: string;
}

Prestamo.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_usuario: { 
    type: DataTypes.INTEGER, 
    references: { model: Usuario, key: 'id' },
    allowNull: false 
  },
  id_equipo: { 
    type: DataTypes.INTEGER, 
    references: { model: Equipo, key: 'id' },
    allowNull: false 
  },
  id_responsable_entrega: { 
    type: DataTypes.INTEGER, 
    references: { model: Usuario, key: 'id' },
    allowNull: true // Es nulo hasta que un admin lo aprueba
  },
  fecha_solicitud: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_entrega: { type: DataTypes.DATE },
  fecha_devolucion: { type: DataTypes.DATE },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'entregado', 'devuelto', 'rechazado'), 
    defaultValue: 'pendiente' 
  },
  observaciones: { type: DataTypes.TEXT },
  motivo_rechazo: { type: DataTypes.TEXT },
  observaciones_devolucion: { type: DataTypes.TEXT }
}, {
  sequelize,
  tableName: 'prestamos',
  underscored: true,
  timestamps: true, // Esto te crea el created_at y updated_at automáticamente
});

// Relaciones (Mantenemos las tuyas que están perfectas)
Usuario.hasMany(Prestamo, { foreignKey: 'id_usuario' });
Prestamo.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'solicitante' });

Equipo.hasMany(Prestamo, { foreignKey: 'id_equipo' });
Prestamo.belongsTo(Equipo, { foreignKey: 'id_equipo' });

Prestamo.belongsTo(Usuario, { foreignKey: 'id_responsable_entrega', as: 'responsable' });

export default Prestamo;