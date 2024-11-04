import User from './UsersModel';
import Product from './ProductModel';
import Order from './OrderModel';
import Category from './CategoryModel';
import Images from './ProductImage';
import Cart from './CartModel';
import { sequelize } from '../config/config';

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
    Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    
    Product.hasMany(Cart, { foreignKey: 'productId', as: 'cartItems' });
    Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    Product.hasMany(Images, { foreignKey: 'productId', as: 'images' });
    Images.belongsTo(Product, { foreignKey: 'productId' });

    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    Product.hasMany(Order, { foreignKey: 'productId' });
    Order.belongsTo(Product, { foreignKey: 'productId' });

    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

    

    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { User, Product, Order, Category, initModels, Images, Cart };
