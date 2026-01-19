const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'cafeteria.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize schema
const createTable = `
    CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        is_available INTEGER DEFAULT 1
    )
`;

db.exec(createTable);
console.log("Table 'menu_items' ready.");

module.exports = db;
