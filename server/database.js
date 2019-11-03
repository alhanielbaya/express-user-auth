const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(
      path.resolve('./server/database/database.sqlite'),
      err => {
        if (err) {
          throw err;
        }

        console.log('connected to database');
      }
    );
    this.rows = [];
  }

  // DEVELOPMENT PURPOSES ONLY
  query(sql, params) {
    this.db.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }

      console.log(rows);
    });
  }
}

module.exports = new Database();
