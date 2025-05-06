const { getDBConnection } = require('../config/db');

class Event {
  static getAll(userId) {
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `SELECT * FROM events WHERE user_id = ? ORDER BY start_date ASC`;
      
      db.all(sql, [userId], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
  
  static getById(id, userId) {
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `SELECT * FROM events WHERE id = ? AND user_id = ?`;
      
      db.get(sql, [id, userId], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }
  
  static create(eventData) {
    const { title, description, start_date, end_date, user_id } = eventData;
    
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `INSERT INTO events (title, description, start_date, end_date, user_id) 
                  VALUES (?, ?, ?, ?, ?)`;
      
      db.run(sql, [title, description, start_date, end_date, user_id], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ 
          id: this.lastID, 
          title, 
          description, 
          start_date, 
          end_date, 
          user_id 
        });
      });
    });
  }
  
  static update(id, eventData, userId) {
    const { title, description, start_date, end_date } = eventData;
    
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `UPDATE events 
                  SET title = ?, description = ?, start_date = ?, end_date = ? 
                  WHERE id = ? AND user_id = ?`;
      
      db.run(sql, [title, description, start_date, end_date, id, userId], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          resolve(null); // No event was updated (not found or not owned by user)
        } else {
          resolve({ 
            id: parseInt(id), 
            title, 
            description, 
            start_date, 
            end_date, 
            user_id: userId 
          });
        }
      });
    });
  }
  
  static delete(id, userId) {
    return new Promise((resolve, reject) => {
      const db = getDBConnection();
      const sql = `DELETE FROM events WHERE id = ? AND user_id = ?`;
      
      db.run(sql, [id, userId], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = Event;