const cron = require('node-cron');
const db = require('../models/db');
const WeatherService = require('./weatherService');
const FraudDetection = require('./fraudDetection');
const { payout } = require('./payoutService');
const { sendNotification } = require('./notificationService');

// This simulates the trigger check every 30 mins
class TriggerMonitor {

    static startMonitoring() {
        console.log("Started parametric trigger monitoring (runs every 30 mins)...");

        // cron string: "*/30 * * * *"
        cron.schedule('*/30 * * * *', async () => {
            this.checkAllCities();
        });
    }

    static async checkAllCities() {
        const cities = ['Chennai', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad'];
        for (const city of cities) {
            const riskData = await WeatherService.getLiveRiskData(city);

            // TRIGGER 1: HEAVY RAIN (>50mm in 24h, mock using 10mm for easier triggering)
            if (riskData.totalRain > 10) {
                await this.triggerEvent(city, 'HEAVY RAIN', riskData);
            }

            // TRIGGER 2: EXTREME HEAT (>43C, mock using 42C for easier triggering)
            if (riskData.maxTemp > 42) {
                await this.triggerEvent(city, 'EXTREME HEAT', riskData);
            }

            // TRIGGER 3: SEVERE AIR POLLUTION (AQI > 400, mock using 150)
            if (riskData.maxAqi > 150) {
                await this.triggerEvent(city, 'SEVERE AQI', riskData);
            }
            
            // TRIGGERS 4 (Curfew/Strike) and 5 (Flood/Natural Disaster) 
            // are triggered manually via API and use the same triggerEvent method.
        }
    }

    // Create event and process automated payouts
    static async triggerEvent(city, triggerType, eventData) {
        try {
            db.prepare(
                `INSERT INTO trigger_events (city, trigger_type, severity, event_data) VALUES (?, ?, ?, ?)`
            ).run(city, triggerType, 'High', JSON.stringify(eventData));

            console.log(`[TRIGGER ALERT] ${triggerType} detected in ${city}`);
            TriggerMonitor.autoGenerateClaims(city, triggerType);
        } catch (err) {
            console.error('Error inserting trigger event:', err.message);
        }
    }

    static autoGenerateClaims(city, triggerType) {
        try {
            // Find all active policies in this city
            const policies = db.prepare(
                `SELECT p.*, w.id as worker_id, w.city, w.phone, w.name, w.weekly_earnings 
           FROM policies p 
           JOIN workers w ON p.worker_id = w.id 
           WHERE w.city = ? AND p.status = 'ACTIVE'`
            ).all(city);

            if (!policies || policies.length === 0) return;

            policies.forEach(async (policy) => {
                // Calculate payout based on trigger type and specs
                let payoutAmount = 0;
                const dailyWage = policy.weekly_earnings / 7;
                
                if (triggerType === 'HEAVY RAIN') payoutAmount = dailyWage * 0.5 * 4; // Mock 4 affected hours
                else if (triggerType === 'EXTREME HEAT') payoutAmount = dailyWage * 0.3;
                else if (triggerType === 'SEVERE AQI') payoutAmount = dailyWage * 0.4;
                else if (triggerType === 'CURFEW/STRIKE') payoutAmount = dailyWage * 1.0;
                else if (triggerType === 'FLOOD') payoutAmount = policy.coverage_amount;
                else payoutAmount = dailyWage * 0.4; // fallback

                payoutAmount = Math.round(payoutAmount);

                // Fraud Check
                const evaluation = FraudDetection.evaluateClaim(
                    { triggerType, claimedAmount: payoutAmount },
                    { created_at: new Date(Date.now() - 30*24*60*60*1000), weekly_earnings: policy.weekly_earnings }, // mock a 30-day old worker
                    [], // mockup empty recent claims
                    true // weather confirmed true
                );

                let txnId = null;
                let claimStatus = evaluation.decision; // 'APPROVED' | 'UNDER REVIEW' | 'REJECTED'

                // If approved instantly, simulate payout
                if (claimStatus === 'APPROVED') {
                    try {
                        const receipt = await payout({ amount: payoutAmount, workerId: policy.worker_id, note: triggerType });
                        txnId = receipt.transactionId;
                        
                        // Send positive notification
                        sendNotification({
                            to: policy.phone,
                            message: `Hi ${policy.name}, a parametric trigger (${triggerType}) was fired in ${city}. A payout of ₹${payoutAmount} has been processed to your account. Txn ID: ${txnId}`,
                            channel: 'WhatsApp'
                        });
                    } catch (e) {
                        console.error("Payout failed for worker", policy.worker_id, e);
                        claimStatus = 'FAILED_PAYOUT';
                    }
                } else if (claimStatus === 'UNDER REVIEW') {
                     // Send hold notification
                     sendNotification({
                        to: policy.phone,
                        message: `Hi ${policy.name}, a parametric trigger (${triggerType}) was fired in ${city}. Your payout of ₹${payoutAmount} is under secondary review and will be held for up to 4 hours.`,
                        channel: 'SMS'
                    });
                }

                db.prepare(
                    `INSERT INTO claims (worker_id, trigger_type, payout_amount, fraud_score, status, transaction_id, rejection_reason) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
                ).run(policy.worker_id, triggerType, payoutAmount, evaluation.fraudScore, claimStatus, txnId, evaluation.flags.join(', '));
            });
        } catch (err) {
            console.error('Error generating claims:', err.message);
        }
    }
}

module.exports = TriggerMonitor;
