const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'models', 'sqlite.db');
const db = new sqlite3.Database(dbPath);

async function fixPasswords() {
    const hash = await bcrypt.hash('password123', 10);
    db.run(`UPDATE workers SET password = ?`, [hash], (err) => {
        if (err) console.error(err);
        else console.log("All worker passwords reset to 'password123'");
    });
}

fixPasswords();
