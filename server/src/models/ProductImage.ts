import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
// import Product from './ProductModel';

class ProductImage extends Model {}

ProductImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {  
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id',
    },
    allowNull: false,
  },
}, { 
  sequelize,
  modelName: 'ProductImage',
  tableName: 'product_images',
  timestamps: true,
});

// Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
// ProductImage.belongsTo(Product, { foreignKey: 'productId' });

export default ProductImage;
