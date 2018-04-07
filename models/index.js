import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const db = {};

const isDev = process.env.NODE_ENV === 'development';

const pathToSqlight = 'sqlite:./db.sqlite';
const pgUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(isDev ? pathToSqlight : pgUrl);

const isModel = file =>
  path.extname(file) === '.js' && file !== 'index.js';

fs
  .readdirSync(__dirname)
  .filter(isModel)
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
