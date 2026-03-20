// backend/routes/policies.js
const express = require('express');
const db = require('../models/db');
const PremiumCalculator = require('../services/premiumCalculator');
const WeatherService = require('../services/weatherService');
const router = express.Router();
const SECRET = 'gigshield_secret_key_demo'; // placeholder

// Middleware to verify JWT (reuse from workers)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  const jwt = require('jsonwebtoken');
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Create a new policy for the logged-in worker
router.post('/create', authenticateToken, async (req, res) => {
  const workerId = req.user.id;
  const { planName } = req.body; // Basic | Standard | Premium

  try {
    const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const riskData = await WeatherService.getLiveRiskData(worker.city);
    const claimCount = 0; // for demo, could query past week
    const premium = PremiumCalculator.calculatePremium(planName, riskData, claimCount, worker.experience_years);
    const coverageMap = { Basic: 500, Standard: 1000, Premium: 2000 };
    const coverage = coverageMap[planName] || 500;
    const now = new Date();
    const validFrom = now.toISOString();
    const validTo = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const result = db.prepare(
      `INSERT INTO policies (worker_id, plan_name, weekly_premium, coverage_amount, valid_from, valid_to, status) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`
    ).run(workerId, planName, premium, coverage, validFrom, validTo);

    res.json({ policyId: result.lastInsertRowid, premium, coverage, validFrom, validTo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Renew an existing active policy (simple extension of validity)
router.post('/renew', authenticateToken, (req, res) => {
  const workerId = req.user.id;

  try {
    const policy = db.prepare(
      `SELECT * FROM policies WHERE worker_id = ? AND status = 'ACTIVE' ORDER BY id DESC LIMIT 1`
    ).get(workerId);

    if (!policy) return res.status(404).json({ error: 'Active policy not found' });

    const newValidFrom = new Date();
    const newValidTo = new Date(newValidFrom.getTime() + 7 * 24 * 60 * 60 * 1000);

    db.prepare(`UPDATE policies SET valid_from = ?, valid_to = ? WHERE id = ?`)
      .run(newValidFrom.toISOString(), newValidTo.toISOString(), policy.id);

    res.json({ message: 'Policy renewed', validFrom: newValidFrom, validTo: newValidTo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
