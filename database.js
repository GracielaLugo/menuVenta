const Database = require('better-sqlite3');
const path = require('path');

const fs = require('fs');

// Check if running on Vercel (or any read-only env where we need tmp)
const isVercel = process.env.VERCEL === '1';

let dbPath;
if (isVercel) {
    // In Vercel, we can only write to /tmp
    // We copy the source DB to /tmp so we can read/write to it (ephemerally)
    const sourcePath = path.resolve(__dirname, 'cafeteria.db');
    const tmpPath = path.resolve('/tmp', 'cafeteria.db');

    // Only copy if it doesn't exist in tmp yet (for this lambda instance)
    // copying might be needed every cold start.
    try {
        fs.copyFileSync(sourcePath, tmpPath);
        console.log("Database copied to /tmp/cafeteria.db");
    } catch (err) {
        console.error("Error copying DB to /tmp:", err);
        // Fallback or restart might be needed, but let's try proceeding or creating new
    }
    dbPath = tmpPath;
} else {
    // Local development
    dbPath = path.resolve(__dirname, 'cafeteria.db');
}

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
