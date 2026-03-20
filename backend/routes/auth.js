const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const WeatherService = require('../services/weatherService');
const PremiumCalculator = require('../services/premiumCalculator');

const router = express.Router();
const SECRET = 'gigshield_secret_key_demo'; // Hardcoded for hackathon demo

// Worker Registration
router.post('/register', async (req, res) => {
    const { name, phone, password, city, zone, platform, weekly_earnings, experience_years } = req.body;

    try {
        // 1. Fetch Live Risk Data
        const riskData = await WeatherService.getLiveRiskData(city);

        // 2. Calculate Risk Profile
        const { score, tier, recommendedPlan } = PremiumCalculator.calculateRiskProfile(riskData);

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save to DB
        const stmt = db.prepare(
            `INSERT INTO workers (name, phone, password, city, zone, platform, weekly_earnings, experience_years, risk_score, risk_tier, recommended_plan) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const result = stmt.run(name, phone, hashedPassword, city, zone, platform, weekly_earnings, experience_years, score, tier, recommendedPlan);

        res.status(201).json({
            message: 'Worker registered successfully',
            workerId: result.lastInsertRowid,
            riskProfile: { score, tier, recommendedPlan }
        });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Worker & Admin Login
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    if (phone === 'admin' && password === 'admin') {
        const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1d' });
        return res.json({ token, role: 'admin' });
    }

    try {
        const worker = db.prepare(`SELECT * FROM workers WHERE phone = ?`).get(phone);
        if (!worker) return res.status(400).json({ error: 'Worker not found' });

        const validPassword = await bcrypt.compare(password, worker.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: worker.id, role: 'worker', city: worker.city }, SECRET, { expiresIn: '7d' });
        res.json({ token, role: 'worker', worker });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
