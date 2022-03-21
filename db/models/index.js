const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const basename = path.basename(__filename);
const { environment } = require('../../config');
const config = require('../../config/database.js')[environment];

const db = {};

db.init = () => {
  mongoose.connect(config.database.url, config.database.options);

  mongoose.connection.on('connected', () => {
    console.log('MongoDB has successfully connected!');
  });

  mongoose.connection.on('err', err => {
    console.error(`Mongoose connection error: \n${err.stack}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose connection lost');
  });
};

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.resolve(__dirname, file))(mongoose);
    db[model.modelName] = model;
  });

db.mongoose = mongoose;

module.exports = db;
