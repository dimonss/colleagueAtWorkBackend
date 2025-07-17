import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import { initDatabase } from './databaseInit';

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
      const dbPath = process.env.NODE_ENV === 'prod' ? './colleagues.db' : './test-colleagues.db';
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log(`Connected to SQLite database: ${dbPath}`);
          if (process.env.NODE_ENV !== 'test') {
            initDatabase(this.db!);
          }
        }
      });
    }
    return this.db;
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