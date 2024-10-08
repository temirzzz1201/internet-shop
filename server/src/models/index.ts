import User from './UsersModel';
import Product from './ProductModel';
import Order from './OrderModel';
import Category from './CategoryModel';
import { sequelize } from '../config/config';

User.hasMany(Order);
Order.belongsTo(User);

Product.hasMany(Order);
Order.belongsTo(Product);

Category.hasMany(Product);
Product.belongsTo(Category);

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: false });  // Синхронизируем все модели
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { User, Product, Order, Category, initModels };
