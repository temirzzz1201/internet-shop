import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/config';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;

  public async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    defaultValue: 'customer'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [8, 100],
        msg: 'Password must be at least 6 characters long',
      },
    },
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,

  hooks: {
    beforeCreate: async (user: User) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 5);
      }
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 5);
      }
    },
  },
});

export default User;
