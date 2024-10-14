import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';

class Category extends Model { }

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true, 
});

export default Category;
