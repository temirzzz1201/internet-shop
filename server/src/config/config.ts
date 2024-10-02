import 'dotenv/config'
import { Sequelize } from 'sequelize';

const database = process.env.DB ?? '';
const user = process.env.USER ?? '';
const password = process.env.PASSWD ?? '';
const host = process.env.HOST ?? '';

if (!database || !user || !password || !host) {
  throw new Error('DB environment variable is not set');
}

export const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',
  logging: true,
});
