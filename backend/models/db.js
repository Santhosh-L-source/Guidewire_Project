const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'sqlite.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Workers Table
            db.run(`CREATE TABLE IF NOT EXISTS workers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT UNIQUE,
                password TEXT,
                name TEXT,
                city TEXT,
                zone TEXT,
                platform TEXT,
                weekly_earnings INTEGER,
                experience_years INTEGER,
                risk_tier TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Claims Table
            db.run(`CREATE TABLE IF NOT EXISTS claims (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER,
                type TEXT,
                amount INTEGER,
                date TEXT,
                status TEXT,
                method TEXT,
                FOREIGN KEY(worker_id) REFERENCES workers(id)
            )`);

            // Notifications Table
            db.run(`CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER,
                title TEXT,
                message TEXT,
                date TEXT,
                is_read BOOLEAN DEFAULT 0,
                FOREIGN KEY(worker_id) REFERENCES workers(id)
            )`);
            
            // Weekly Models Table
            db.run(`CREATE TABLE IF NOT EXISTS weekly_models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER,
                week_start TEXT,
                base_premium INTEGER,
                risk_multiplier REAL,
                final_premium INTEGER,
                FOREIGN KEY(worker_id) REFERENCES workers(id)
            )`);
        });
    }
});

module.exports = db;
