class FraudDetection {

    static evaluateClaim(claimRequest, workerHistory, recentClaims, weatherConfirmation) {
        let score = 0;
        let flags = [];

        // Rule 1: Duplicate check (Same trigger type within 24h)
        // For demo, we just look at the last few claims passed in
        const duplicate = recentClaims.find(c => c.trigger_type === claimRequest.triggerType);
        if (duplicate) {
            score += 30;
            flags.push("Duplicate claim type within recent window");
        }

        // Rule 2: Inactive / New Worker Check
        const daysSinceRegistration = (new Date() - new Date(workerHistory.created_at)) / (1000 * 60 * 60 * 24);
        if (daysSinceRegistration < 7) {
            score += 25;
            flags.push("New worker account velocity limit");
        }

        // Rule 3: Income Anomaly
        if (claimRequest.claimedAmount > (workerHistory.weekly_earnings * 2)) {
            score += 20;
            flags.push("Payout exceeds reasonable income ratio");
        }

        // Rule 4: Velocity Check
        if (recentClaims.length >= 3) {
            score += 15;
            flags.push("High claim velocity (3+ recent claims)");
        }

        // Rule 5: Weather Validation Mismatch
        if (!weatherConfirmation) {
            score += 10;
            flags.push("Weather data does not strongly correlate with claim parameter");
        }

        let decision = 'APPROVED';
        if (score > 60) {
            decision = 'REJECTED';
        } else if (score >= 31) {
            decision = 'UNDER REVIEW'; // Held
        }

        return {
            fraudScore: score,
            decision,
            flags
        };
    }

}

module.exports = FraudDetection;
