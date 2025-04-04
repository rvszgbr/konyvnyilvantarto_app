// Projekt: Könyvnyilvántartó alkalmazás (Node.js + Express + SQLite)

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const upload = multer({ dest: 'public/uploads/' });

const db = new sqlite3.Database('./books.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    category TEXT,
    description TEXT,
    rating INTEGER,
    cover TEXT
  )`);
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/books', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM books';
  let conditions = [];
  let params = [];

  if (search) {
    conditions.push('(title LIKE ? OR author LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category && category !== 'Összes') {
    conditions.push('category = ?');
    params.push(category);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post('/api/books', upload.single('cover'), (req, res) => {
  const { title, author, year, category, description, rating } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  db.get('SELECT * FROM books WHERE title = ? AND author = ?', [title, author], (err, existing) => {
    if (err) return res.status(500).json({ error: err });
    if (existing) {
      return res.status(400).json({ error: 'Ez a könyv már létezik ezzel a szerzővel.' });
    }

    db.run(
      'INSERT INTO books (title, author, year, category, description, rating, cover) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, year, category, description, rating, cover],
      function (err) {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: this.lastID });
      }
    );
  });
});

app.put('/api/books/:id', upload.single('cover'), (req, res) => {
  const { id } = req.params;
  const { title, author, year, category, description, rating } = req.body;
  const newCover = req.file ? `/uploads/${req.file.filename}` : null;

  db.get('SELECT cover FROM books WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err });

    const oldCover = row.cover;
    const query = newCover
      ? 'UPDATE books SET title = ?, author = ?, year = ?, category = ?, description = ?, rating = ?, cover = ? WHERE id = ?'
      : 'UPDATE books SET title = ?, author = ?, year = ?, category = ?, description = ?, rating = ? WHERE id = ?';

    const params = newCover
      ? [title, author, year, category, description, rating, newCover, id]
      : [title, author, year, category, description, rating, id];

    db.run(query, params, function (err) {
      if (err) return res.status(500).json({ error: err });
      if (newCover && oldCover) {
        const filepath = path.join(__dirname, 'public', oldCover);
        fs.unlink(filepath, () => {});
      }
      res.json({ updated: this.changes });
    });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT cover FROM books WHERE id = ?', [id], (err, row) => {
    if (row && row.cover) {
      const filepath = path.join(__dirname, 'public', row.cover);
      fs.unlink(filepath, () => {});
    }
    db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ deleted: this.changes });
    });
  });
});

app.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});
