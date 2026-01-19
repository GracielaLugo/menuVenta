const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET /api/menu - Get all items
app.get('/api/menu', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM menu_items');
        const rows = stmt.all();
        res.json({
            message: 'success',
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/menu/:id - Get single item
app.get('/api/menu/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM menu_items WHERE id = ?');
        const row = stmt.get(req.params.id);

        if (!row) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/menu - Create new item
app.post('/api/menu', (req, res) => {
    const { name, description, price, category } = req.body;

    // Simple validation
    if (!name || !price) {
        res.status(400).json({ error: 'Please provide name and price' });
        return;
    }

    try {
        const stmt = db.prepare('INSERT INTO menu_items (name, description, price, category) VALUES (?,?,?,?)');
        const info = stmt.run(name, description, price, category);

        res.status(201).json({
            message: 'success',
            data: {
                id: info.lastInsertRowid,
                name,
                description,
                price,
                category
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/menu/:id - Update item
app.put('/api/menu/:id', (req, res) => {
    const { name, description, price, category, is_available } = req.body;

    try {
        // We use COALESCE-like logic in SQL or js level. 
        // better-sqlite3 is sync, so we can fetch then update, or just one UPDATE query.
        // Let's use the same query logic.
        const sql = `UPDATE menu_items SET 
            name = COALESCE(?, name), 
            description = COALESCE(?, description),
            price = COALESCE(?, price),
            category = COALESCE(?, category),
            is_available = COALESCE(?, is_available)
            WHERE id = ?`;

        const stmt = db.prepare(sql);
        const info = stmt.run(name, description, price, category, is_available, req.params.id);

        if (info.changes === 0) {
            res.status(404).json({ error: 'Item not found or no changes made' });
            return;
        }
        res.json({
            message: 'success',
            changes: info.changes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/menu/:id - Delete item
app.delete('/api/menu/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
        const info = stmt.run(req.params.id);

        res.json({
            message: 'deleted',
            changes: info.changes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
