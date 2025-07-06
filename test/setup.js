const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Создаем тестовую базу данных
const testDbPath = './test-colleagues.db';

// Удаляем старую тестовую БД если она существует
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

// Создаем новую тестовую БД
const db = new sqlite3.Database(testDbPath);

// Инициализируем тестовую БД
db.serialize(() => {
  // Создаем таблицу colleagues
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Создаем таблицу users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (!err) {
      // Создаем тестового пользователя
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", 
        ['admin', hashedPassword]);
    }
  });
});

// Экспортируем путь к тестовой БД
module.exports = { testDbPath }; 