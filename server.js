const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files with absolute path
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// GET / - Root route (Explicitly serve index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /api/menu - Get all items
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*');

        if (error) throw error;

        res.json({
            message: 'success',
            data: data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/menu/:id - Get single item
app.get('/api/menu/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.json({
            message: 'success',
            data: data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/menu - Create new item
app.post('/api/menu', async (req, res) => {
    const { producto, quantidade, precio } = req.body;
    // Note: User asked for 'cantidad' in DB, but sometimes sends 'quantity'. 
    // We stick to 'cantidad' as requested in schema.
    const cantidad = req.body.cantidad || 0;

    if (!producto || !precio) {
        res.status(400).json({ error: 'Please provide producto and precio' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .insert([{ producto, cantidad, precio }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'success',
            data: data[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/menu/:id - Update item
app.put('/api/menu/:id', async (req, res) => {
    const { producto, cantidad, precio } = req.body;
    const updates = {};
    if (producto !== undefined) updates.producto = producto;
    if (cantidad !== undefined) updates.cantidad = cantidad;
    if (precio !== undefined) updates.precio = precio;

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .update(updates)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            res.status(404).json({ error: 'Item not found or no changes made' });
            return;
        }

        res.json({
            message: 'success',
            changes: 1,
            data: data[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/menu/:id - Delete item
app.delete('/api/menu/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({
            message: 'deleted'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
