const Model = require('./_Model');

class User extends Model {
  constructor() {
    super();
  }

   registerUser(name, email, password) {
    let hashedPassword;
    const bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        // Set password to hashed password
        hashedPassword = hash;

        this.db.run(
          `INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)`,
          [name, email, hashedPassword],
          err => {
            if (err) throw err;
          }
        );
      });
    });
  }

  queryUsers() {
    var promise = new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        this.rows = rows;
      });

      setTimeout(() => resolve(this.rows.length ? this.rows : []), 100);
    });

    return promise;
  }

  findUserByEmail(email) {
    var promise = new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM users WHERE user_email = ?`,
        [email],
        (err, rows) => {
          if (err) {
            throw err;
          }
          this.rows = rows;
        }
      );

      setTimeout(() => resolve(this.rows.length ? this.rows : false), 100);
    });

    return promise;
  }

  findUserById(id) {
    var promise = new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM users WHERE user_id = ?`,
        [id],
        (err, rows) => {
          if (err) {
            throw err;
          }
          this.rows = rows;
        }
      );

      setTimeout(() => resolve(this.rows.length ? this.rows : false), 100);
    });

    return promise;
  }

  async checkIfEmailExists(email) {
    const rows = await this.findUserByEmail(email);
    return rows.length ? true : false;
  }
}

module.exports = new User();
