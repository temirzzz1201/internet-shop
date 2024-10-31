import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
import Category from './CategoryModel';

class Product extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: number;
}

// Инициализация модели
Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Изменено на DECIMAL для большей точности
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category, // Используйте модель Category напрямую
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
});



export default Product;
