import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare password: string;
  declare rol: 'admin' | 'user'; 
  declare email: string;
  declare area: CreationOptional<string>;

  // Timestamps mapeados correctamente
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Usuario.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  apellido: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  rol: { 
    type: DataTypes.ENUM('admin', 'user'), 
    allowNull: false 
  }, 
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  area: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  // Definimos explícitamente para satisfacer a TypeScript y Sequelize
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at' 
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  sequelize,
  tableName: 'usuarios',
  underscored: true, 
  timestamps: true,
});

export default Usuario;