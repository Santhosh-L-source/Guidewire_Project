const express = require('express');
const db = require('../models/db');
const { authenticateToken } = require('./workers'); // Reuse middleware

const router = express.Router();

// Get Admin Dashboard Overview
router.get('/overview', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const stats = {
        activePolicies: 0,
        premiumsCollected: 0,
        payoutsThisWeek: 0,
        activeFlags: 0,
        lossRatio: 0
    };

    db.get(`SELECT COUNT(*) as count, SUM(weekly_premium) as premium FROM policies WHERE status = 'ACTIVE'`, [], (err, policyStats) => {
        if (policyStats) {
            stats.activePolicies = policyStats.count || 0;
            stats.premiumsCollected = policyStats.premium || 0;
        }

        db.get(`SELECT SUM(payout_amount) as payouts FROM claims WHERE status = 'APPROVED'`, [], (err, claimStats) => {
            if (claimStats) {
                stats.payoutsThisWeek = claimStats.payouts || 0;
            }

            db.get(`SELECT COUNT(*) as flags FROM claims WHERE status = 'UNDER REVIEW'`, [], (err, flagStats) => {
                if (flagStats) {
                    stats.activeFlags = flagStats.flags || 0;
                }

                if (stats.premiumsCollected > 0) {
                    stats.lossRatio = ((stats.payoutsThisWeek / stats.premiumsCollected) * 100).toFixed(1);
                }

                res.json(stats);
            });
        });
    });
});

module.exports = router;
