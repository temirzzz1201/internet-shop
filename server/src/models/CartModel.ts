import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
import User from './UsersModel';
import Product from './ProductModel';

class Cart extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true,
  }
);

export default Cart;
