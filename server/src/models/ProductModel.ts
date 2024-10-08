// import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../config/config';

// class Product extends Model { }

// Product.init({
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   price: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   stock: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// }, {
//   sequelize,
//   modelName: 'Product',
//   tableName: 'products',
//   timestamps: true,
// });

// export default Product;


import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
import Category from './CategoryModel'

class Product extends Model { }

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
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryId: {  // Внешний ключ для связи с категорией
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',  // Указываем таблицу категорий
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
});

// Связь с моделью Category
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

export default Product;
