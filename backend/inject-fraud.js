const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'models', 'sqlite.db');
const db = new sqlite3.Database(dbPath);

const insertClaim = `
INSERT INTO claims (worker_id, trigger_type, payout_amount, fraud_score, status, rejection_reason) 
VALUES (?, ?, ?, ?, ?, ?)
`;

db.serialize(() => {
    // Inject a fake fraud claim
    db.run(insertClaim, [1, 'SEVERE AQI', 250, 75, 'UNDER REVIEW', 'High Claim Velocity']);
    db.run(insertClaim, [1, 'EXTREME HEAT', 175, 50, 'UNDER REVIEW', 'Income Anomaly']);
    console.log("Injected 2 'UNDER REVIEW' fraudulent claims for Admin Dashboard demonstration!");
});
db.close();
