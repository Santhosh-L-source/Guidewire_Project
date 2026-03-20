const express = require('express');
const db = require('../models/db');
const { authenticateToken } = require('./workers'); // Reuse middleware
const TriggerMonitor = require('../services/triggerMonitor');

const router = express.Router();

// Get all claims (Admin)
router.get('/', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    db.all(
        `SELECT c.*, w.name as worker_name, w.city 
     FROM claims c 
     JOIN workers w ON c.worker_id = w.id 
     ORDER BY date(c.created_at) DESC`,
        [],
        (err, claims) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(claims);
        }
    );
});

// Admin Manual Approval / Rejection of Held Claims
router.post('/:id/action', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const claimId = req.params.id;
    const { action } = req.body; // 'APPROVED' or 'REJECTED'

    let txnId = null;
    if (action === 'APPROVED') {
        txnId = `TXN_${Date.now()}`;
    }

    db.run(
        `UPDATE claims SET status = ?, transaction_id = ? WHERE id = ?`,
        [action, txnId, claimId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Claim ${claimId} marked as ${action}` });
        }
    );
});

// Admin Manual Trigger (Social Disruption)
router.post('/trigger', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const { city, triggerType, durationHours } = req.body;

    // Mock event data for manual trigger
    const eventData = { duration: durationHours, note: 'Manually issued by admin' };

    TriggerMonitor.triggerEvent(city, triggerType, eventData);
    res.json({ message: `Manual trigger ${triggerType} initiated for ${city}` });
});

module.exports = router;
