import { Request, Response } from 'express';
import { DatabaseConfig } from '../config/database';
import { Colleague } from '../types';
import { staticDir } from '../config/upload';
import fs from 'fs';
import path from 'path';

// SQLite dialect configuration for IDE support

const PORT = process.env.PORT || 3001;

export class ColleaguesController {
  private static getDatabase() {
    return DatabaseConfig.getInstance().getDatabase();
  }

  // Get all colleagues
  public static async getAllColleagues(req: Request, res: Response): Promise<void> {
    const db = ColleaguesController.getDatabase();
    
    db.all("SELECT * FROM colleagues ORDER BY name", (err, rows: Colleague[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Add full URL to photo filenames
      const colleagues = rows.map(colleague => ({
        ...colleague,
        photo_url: colleague.photo_filename ? `http://localhost:${PORT}/static/${colleague.photo_filename}` : null
      }));
      
      res.json(colleagues);
    });
  }

  // Get single colleague by ID
  public static async getColleagueById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const db = ColleaguesController.getDatabase();
    
    db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, row: Colleague | undefined) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Colleague not found' });
        return;
      }
      
      // Add full URL to photo filename
      const colleague = {
        ...row,
        photo_url: row.photo_filename ? `http://localhost:${PORT}/static/${row.photo_filename}` : null
      };
      
      res.json(colleague);
    });
  }

  // Add new colleague
  public static async createColleague(req: Request, res: Response): Promise<void> {
    const { name, position, department, email, phone, hire_date, salary, notes } = req.body;
    
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    const photo_filename = (req.file as Express.Multer.File)?.filename || null;
    const db = ColleaguesController.getDatabase();
    
    db.run(`
      INSERT INTO colleagues (name, position, department, email, phone, photo_filename, hire_date, salary, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, position, department, email, phone, photo_filename, hire_date, salary, notes], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the newly created colleague
      db.get("SELECT * FROM colleagues WHERE id = ?", [this.lastID], (err, row: Colleague | undefined) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (!row) {
          res.status(500).json({ error: 'Failed to retrieve created colleague' });
          return;
        }
        
        const colleague = {
          ...row,
          photo_url: row.photo_filename ? `http://localhost:${PORT}/static/${row.photo_filename}` : null
        };
        
        res.status(201).json(colleague);
      });
    });
  }

  // Update colleague
  public static async updateColleague(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, position, department, email, phone, hire_date, salary, notes } = req.body;
    const db = ColleaguesController.getDatabase();
    
    // First check if colleague exists
    db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, existingColleague: Colleague | undefined) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!existingColleague) {
        res.status(404).json({ error: 'Colleague not found' });
        return;
      }
      
      // If new photo is uploaded, delete old photo file
      if ((req.file as Express.Multer.File) && existingColleague.photo_filename) {
        const oldPhotoPath = path.join(staticDir, existingColleague.photo_filename);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      
      const photo_filename = (req.file as Express.Multer.File)?.filename || existingColleague.photo_filename;
      
      db.run(`
        UPDATE colleagues 
        SET name = ?, position = ?, department = ?, email = ?, phone = ?, 
            photo_filename = ?, hire_date = ?, salary = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, position, department, email, phone, photo_filename, hire_date, salary, notes, id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Get the updated colleague
        db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, row: Colleague | undefined) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          if (!row) {
            res.status(500).json({ error: 'Failed to retrieve updated colleague' });
            return;
          }
          
          const colleague = {
            ...row,
            photo_url: row.photo_filename ? `http://localhost:${PORT}/static/${row.photo_filename}` : null
          };
          
          res.json(colleague);
        });
      });
    });
  }

  // Delete colleague
  public static async deleteColleague(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const db = ColleaguesController.getDatabase();
    
    // First get the colleague to delete their photo file
    db.get("SELECT photo_filename FROM colleagues WHERE id = ?", [id], (err, colleague: { photo_filename?: string } | undefined) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!colleague) {
        res.status(404).json({ error: 'Colleague not found' });
        return;
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
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ message: 'Colleague deleted successfully' });
      });
    });
  }

  // Update colleague status (is_at_work)
  public static async updateColleagueStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { is_at_work } = req.body;
    const db = ColleaguesController.getDatabase();
    
    if (typeof is_at_work !== 'boolean') {
      res.status(400).json({ error: 'is_at_work must be a boolean value' });
      return;
    }
    
    // First check if colleague exists
    db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, existingColleague: Colleague | undefined) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!existingColleague) {
        res.status(404).json({ error: 'Colleague not found' });
        return;
      }
      
      db.run(`
        UPDATE colleagues 
        SET is_at_work = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [is_at_work, id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Get the updated colleague
        db.get("SELECT * FROM colleagues WHERE id = ?", [id], (err, row: Colleague | undefined) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          if (!row) {
            res.status(500).json({ error: 'Failed to retrieve updated colleague' });
            return;
          }
          
          const colleague = {
            ...row,
            photo_url: row.photo_filename ? `http://localhost:${PORT}/static/${row.photo_filename}` : null
          };
          
          res.json(colleague);
        });
      });
    });
  }
} 