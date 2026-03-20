const express = require('express');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = 'gigshield_secret_key_demo';

// Middleware to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get Worker Profile & Dashboard Stats
router.get('/dashboard', authenticateToken, (req, res) => {
    if (req.user.role !== 'worker') return res.sendStatus(403);

    const workerId = req.user.id;

    // Fetch worker details
    db.get(`SELECT * FROM workers WHERE id = ?`, [workerId], (err, worker) => {
        if (err || !worker) return res.status(404).json({ error: 'Worker not found' });

        // Fetch active policy
        db.get(`SELECT * FROM policies WHERE worker_id = ? AND status = 'ACTIVE' ORDER BY id DESC LIMIT 1`, [workerId], (err, activePolicy) => {

            // Fetch claims history
            db.all(`SELECT * FROM claims WHERE worker_id = ? ORDER BY date(created_at) DESC`, [workerId], (err, claims) => {

                // Calculate total earnings protected
                let totalProtected = 0;
                let weekProtected = 0;
                let monthProtected = 0;

                const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

                if (claims) {
                    claims.forEach(c => {
                        if (c.status === 'APPROVED') {
                            totalProtected += c.payout_amount;
                            const claimDate = new Date(c.created_at);
                            if (claimDate >= oneWeekAgo) weekProtected += c.payout_amount;
                            if (claimDate >= oneMonthAgo) monthProtected += c.payout_amount;
                        }
                    });
                }

                res.json({
                    worker,
                    activePolicy,
                    claims: claims || [],
                    earnings: {
                        thisWeek: weekProtected,
                        thisMonth: monthProtected,
                        lifetime: totalProtected
                    }
                });
            });
        });
    });
});

module.exports = { router, authenticateToken };
