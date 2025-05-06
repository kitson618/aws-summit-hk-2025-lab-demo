const { getDBConnection } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `SELECT * FROM users WHERE email = ?`;
      
      db.get(sql, [email], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }
  
  static findById(id) {
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `SELECT id, name, email, created_at FROM users WHERE id = ?`;
      
      db.get(sql, [id], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }
  
  static async create(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
      
      db.run(sql, [name, email, hashedPassword], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, name, email });
      });
    });
  }
  
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;