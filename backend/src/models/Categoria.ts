import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Categoria extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion_uso!: string;
  public tipo_uso!: string;
  public color!: string;
  public icono?: string;
  
  // Declaración explícita de los campos de tiempo del DER
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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