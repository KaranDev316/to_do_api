const { DB_URL } = require('../config/env');

function connectDatabase() {
  if (!DB_URL) {
    return null;
  }

  return DB_URL;
}

module.exports = {
  connectDatabase
};
