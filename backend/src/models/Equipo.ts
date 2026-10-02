import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Categoria from './Categoria.js';

class Equipo extends Model {
  // Declaramos las propiedades para que TypeScript las reconozca
  declare id: number;
  declare nombre: string;
  declare estado_operativo: 'Disponible' | 'Solicitado' | 'Prestado' | 'Mantenimiento';
}

Equipo.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_categoria: { 
    type: DataTypes.INTEGER, 
    references: { model: Categoria, key: 'id' } 
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  marca: { type: DataTypes.STRING },
  modelo: { type: DataTypes.STRING },
  nro_serie: { type: DataTypes.STRING },
  estado_operativo: { 
    type: DataTypes.ENUM('Disponible', 'Solicitado', 'Prestado', 'Mantenimiento'),
    defaultValue: 'Disponible' 
  },
  nro_patrimonio: { type: DataTypes.STRING },
  observaciones: { type: DataTypes.TEXT },
  propietario: { type: DataTypes.TEXT },
  codigo: { type: DataTypes.STRING },
  patrimonio_unq: { type: DataTypes.BOOLEAN, defaultValue: false },
  imagen_url: { type: DataTypes.STRING }
}, {
  sequelize,
  tableName: 'equipos',
  underscored: true,
});

// Relación según tu DER
Categoria.hasMany(Equipo, { foreignKey: 'id_categoria' });
Equipo.belongsTo(Categoria, { foreignKey: 'id_categoria' });

export default Equipo;
