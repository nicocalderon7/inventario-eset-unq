import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Categoria extends Model {
  declare id: number;
  declare nombre: string;
  declare descripcion_uso: string;
  declare tipo_uso: string;
  declare color: string;
  declare icono?: string;
  
  // Declaración explícita de los campos de tiempo del DER
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Categoria.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descripcion_uso: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  tipo_uso: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  color: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  icono: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
}, {
  sequelize,
  tableName: 'categorias',
  underscored: true, // Asegura que en la DB sea created_at y updated_at
  timestamps: true,  // Habilita la gestión automática de fechas
});

export default Categoria;