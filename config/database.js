const { db } = require('./index');

const { mongoUrl, mongoDevUrl } = db;

module.exports = {
  development: {
    database: {
      url: mongoDevUrl,
      options: {
        useNewUrlParser: true,
      },
    },
  },
  production: {
    database: {
      url: mongoUrl,
      options: {
        useNewUrlParser: true,
      },
    },
  },
};
