import { Database } from 'sqlite3';
import bcrypt from 'bcryptjs';
import { getCurrentSQLiteTimestamp } from '../utils/dateHelper';

export function initDatabase(db: Database): void {
  db.serialize(() => {
    // Create colleagues table
    db.run(`CREATE TABLE IF NOT EXISTS colleagues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT,
      department TEXT,
      email TEXT,
      phone TEXT,
      photo_filename TEXT,
      hire_date TEXT,
      salary REAL,
      notes TEXT,
      is_at_work BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT '${getCurrentSQLiteTimestamp()}',
      updated_at DATETIME DEFAULT '${getCurrentSQLiteTimestamp()}'
    )`);

    // Create users table for basic auth
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT '${getCurrentSQLiteTimestamp()}'
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        // Create default admin user if table is empty
        db.get("SELECT COUNT(*) as count FROM users", (err, row: any) => {
          if (err) {
            console.error('Error checking users:', err.message);
          } else if (row.count === 0) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", 
              ['admin', hashedPassword], (err) => {
              if (err) {
                console.error('Error creating default user:', err.message);
              } else {
                console.log('Default admin user created (username: admin, password: admin123)');
              }
            });
          }
        });
      }
    });
  });
} 