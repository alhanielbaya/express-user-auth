class Model {
  constructor() {
    this.db = require('../database').db;
  }

  close() {
    this.db.close();
  }
}

module.exports = Model;
