import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const db = {};

const env = process.env.NODE_ENV || 'development';
const configFile = fs.readFileSync(path.join(__dirname, '..', 'config/config.json'), 'utf8');
const config = JSON.parse(configFile)[env];

const sequelize = new Sequelize(config.url);

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
