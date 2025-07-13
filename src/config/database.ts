import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

// SQLite dialect configuration for IDE support

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private db: Database | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getDatabase(): Database {
    if (!this.db) {
      const dbPath = process.env.NODE_ENV === 'test' ? './test-colleagues.db' : './colleagues.db';
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log(`Connected to SQLite database: ${dbPath}`);
          if (process.env.NODE_ENV !== 'test') {
            this.initDatabase();
          }
        }
      });
    }
    return this.db;
  }

  private initDatabase(): void {
    const db = this.getDatabase();
    
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create users table for basic auth
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          // Create default admin user if table is empty
          db.get("SELECT COUNT(*) as count FROM users", (err, row: any) => {
            if (err) {
              console.error('Error checking users:', err.message);
            } else if (row.count === 0) {
              const bcrypt = require('bcryptjs');
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

  public closeDatabase(): void {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    }
  }
} 