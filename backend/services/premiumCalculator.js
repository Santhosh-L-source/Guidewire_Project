// Premium Calculation Logic
// Uses dynamic multipliers based on weather, AQI, and user history.

class PremiumCalculator {

    static calculatePremium(planTier, riskData, claimCount, experienceYears) {
        // Base Rates
        const baseRates = {
            'Basic': 29,
            'Standard': 49,
            'Premium': 79
        };

        let base = baseRates[planTier] || 49;

        let rainMultiplier = 0;
        let aqiMultiplier = 0;
        let claimMultiplier = 0;
        let experienceDiscount = 0;
        let loyaltyDiscount = 0;

        // Rain Multiplier
        if (riskData.totalRain > 50) {
            rainMultiplier = 0.25; // Heavy
        } else if (riskData.totalRain >= 10) {
            rainMultiplier = 0.10; // Moderate
        }

        // AQI Multiplier
        if (riskData.maxAqi > 300) {
            aqiMultiplier = 0.20;
        } else if (riskData.maxAqi >= 100) {
            aqiMultiplier = 0.10;
        }

        // Claim History Multiplier
        if (claimCount === 0) {
            loyaltyDiscount = 0.10;
        } else if (claimCount >= 3) {
            claimMultiplier = 0.15;
        }

        // Experience Bonus
        if (experienceYears >= 3) {
            experienceDiscount = 0.05;
        }

        const finalPremium = base
            * (1 + rainMultiplier)
            * (1 + aqiMultiplier)
            * (1 + claimMultiplier)
            * (1 - loyaltyDiscount)
            * (1 - experienceDiscount);

        return Math.round(finalPremium);
    }

    // Risk Profiler based on live data
    static calculateRiskProfile(riskData) {
        let score = 0;
        let tier = 'Low';
        let recommendedPlan = 'Basic';

        if (riskData.totalRain > 20) score += 30;
        if (riskData.maxAqi > 150) score += 20;
        if (riskData.maxTemp > 40) score += 30;

        if (score >= 60) {
            tier = 'High';
            recommendedPlan = 'Premium';
        } else if (score >= 30) {
            tier = 'Medium';
            recommendedPlan = 'Standard';
        }

        return { score, tier, recommendedPlan };
    }
}

module.exports = PremiumCalculator;
