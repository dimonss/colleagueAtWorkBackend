const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { initDatabase } = require('./src/config/databaseInit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create static directory if it doesn't exist
const staticDir = path.join(__dirname, 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Serve static files from static directory
app.use('/static', express.static(staticDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, staticDir);
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uuid + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Database setup
const dbPath = process.env.NODE_ENV === 'prod' ? './colleagues.db' : './test-colleagues.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database: ${dbPath}`);
    initDatabase(db);
  }
});

// Basic authentication middleware
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Colleagues API"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Colleagues API"');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.user = user;
    next();
  });
}

// API Routes

// Get all colleagues
app.get('/api/colleagues', (req, res) => {
  db.all("SELECT * FROM colleagues ORDER BY name", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Add full URL to photo filenames
    const colleagues = rows.map(colleague => ({
      ...colleague,
      photo_url: colleague.photo_filename ? (process.env.NODE_ENV === 'prod' ? `https://chalysh.tech/colleagues/static/${colleague.photo_filename}` : `http://localhost:${PORT}/static/${colleague.photo_filename}`) : null
    }));
    
    res.json(colleagues);
  });
});

// Get single colleague by ID
app.get('/api/colleagues/:id', (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Colleague not found' });
    }
    
    // Add full URL to photo filename
    const colleague = {
      ...row,
      photo_url: row.photo_filename ? (process.env.NODE_ENV === 'prod' ? `https://chalysh.tech/colleagues/static/${row.photo_filename}` : `http://localhost:${PORT}/static/${row.photo_filename}`) : null
    };
    
    res.json(colleague);
  });
});

// Add new colleague (requires authentication)
app.post('/api/colleagues', basicAuth, upload.single('photo'), (req, res) => {
  const { name, position, department, email, phone, hire_date, salary, notes } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const photo_filename = req.file ? req.file.filename : null;
  
  db.run(`
    INSERT INTO colleagues (name, position, department, email, phone, photo_filename, hire_date, salary, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, position, department, email, phone, photo_filename, hire_date, salary, notes], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get the newly created colleague
    db.get("SELECT * FROM colleagues WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const colleague = {
        ...row,
        photo_url: row.photo_filename ? (process.env.NODE_ENV === 'prod' ? `https://chalysh.tech/colleagues/static/${row.photo_filename}` : `http://localhost:${PORT}/static/${row.photo_filename}`) : null
      };
      
      res.status(201).json(colleague);
    });
  });
});

// Update colleague (requires authentication)
app.put('/api/colleagues/:id', basicAuth, upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { name, position, department, email, phone, hire_date, salary, notes } = req.body;
  
  // First check if colleague exists
  db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, existingColleague) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!existingColleague) {
      return res.status(404).json({ error: 'Colleague not found' });
    }
    
    // If new photo is uploaded, delete old photo file
    if (req.file && existingColleague.photo_filename) {
      const oldPhotoPath = path.join(staticDir, existingColleague.photo_filename);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    
    const photo_filename = req.file ? req.file.filename : existingColleague.photo_filename;
    
    db.run(`
      UPDATE colleagues 
      SET name = ?, position = ?, department = ?, email = ?, phone = ?, 
          photo_filename = ?, hire_date = ?, salary = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, position, department, email, phone, photo_filename, hire_date, salary, notes, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Get the updated colleague
      db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const colleague = {
          ...row,
          photo_url: row.photo_filename ? (process.env.NODE_ENV === 'prod' ? `https://chalysh.tech/colleagues/static/${row.photo_filename}` : `http://localhost:${PORT}/static/${row.photo_filename}`) : null
        };
        
        res.json(colleague);
      });
    });
  });
});

// Delete colleague (requires authentication)
app.delete('/api/colleagues/:id', basicAuth, (req, res) => {
  const { id } = req.params;
  
  // First get the colleague to delete their photo file
  db.get("SELECT photo_filename FROM colleagues WHERE id = ?", [id], (err, colleague) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!colleague) {
      return res.status(404).json({ error: 'Colleague not found' });
    }
    
    // Delete the photo file if it exists
    if (colleague.photo_filename) {
      const photoPath = path.join(staticDir, colleague.photo_filename);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    // Delete from database
    db.run("DELETE FROM colleagues WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ message: 'Colleague deleted successfully' });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation:`);
    console.log(`GET    /api/colleagues     - Get all colleagues`);
    console.log(`GET    /api/colleagues/:id - Get single colleague`);
    console.log(`POST   /api/colleagues     - Add new colleague (Basic Auth required)`);
    console.log(`PUT    /api/colleagues/:id - Update colleague (Basic Auth required)`);
    console.log(`DELETE /api/colleagues/:id - Delete colleague (Basic Auth required)`);
    console.log(`\nDefault admin credentials: admin / admin123`);
    console.log(`Static files served from: /static`);
  });
} 