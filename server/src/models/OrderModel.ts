import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
import User from './UsersModel';
import Product from './ProductModel';

class Order extends Model { }

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', 
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
});


// User.hasMany(Order, { foreignKey: 'userId' });
// Order.belongsTo(User, { foreignKey: 'userId' });

// Product.hasMany(Order, { foreignKey: 'productId' });
// Order.belongsTo(Product, { foreignKey: 'productId' });


export default Order;