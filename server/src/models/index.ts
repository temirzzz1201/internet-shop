import User from './UsersModel';
import Product from './ProductModel';
import Order from './OrderModel';
import Category from './CategoryModel';
import { sequelize } from '../config/config';

User.hasMany(Order);
Order.belongsTo(User);

Product.hasMany(Order);
Order.belongsTo(Product);

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: false });  
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { User, Product, Order, Category, initModels };
