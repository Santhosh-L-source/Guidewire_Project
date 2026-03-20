const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'sqlite.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

console.log('Connected to the SQLite database.');

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE,
        password TEXT,
        name TEXT,
        city TEXT,
        zone TEXT,
        platform TEXT,
        weekly_earnings INTEGER,
        experience_years INTEGER,
        risk_score REAL,
        risk_tier TEXT,
        recommended_plan TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id INTEGER,
        plan_name TEXT,
        weekly_premium INTEGER,
        coverage_amount INTEGER,
        valid_from TEXT,
        valid_to TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(worker_id) REFERENCES workers(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id INTEGER,
        trigger_type TEXT,
        payout_amount INTEGER,
        fraud_score REAL,
        status TEXT,
        transaction_id TEXT,
        rejection_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(worker_id) REFERENCES workers(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id INTEGER,
        title TEXT,
        message TEXT,
        date TEXT,
        is_read BOOLEAN DEFAULT 0,
        FOREIGN KEY(worker_id) REFERENCES workers(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id INTEGER,
        week_start TEXT,
        base_premium INTEGER,
        risk_multiplier REAL,
        final_premium INTEGER,
        FOREIGN KEY(worker_id) REFERENCES workers(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS trigger_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        trigger_type TEXT,
        severity TEXT,
        event_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
