const axios = require('axios');

// Basic in-memory cache for coordinates to avoid redundant geocoding API calls
const cityCoordsCache = {};

class WeatherService {

    // 1. Get Coordinates from City Name
    static async getCoordinates(city) {
        if (cityCoordsCache[city]) return cityCoordsCache[city];

        try {
            const resp = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
            if (resp.data.results && resp.data.results.length > 0) {
                const { latitude, longitude } = resp.data.results[0];
                cityCoordsCache[city] = { latitude, longitude };
                return { latitude, longitude };
            }
            throw new Error("City not found");
        } catch (error) {
            console.error("Geocoding Error:", error.message);
            // Fallback rough coordinates if API fails
            const fallbacks = {
                'Chennai': { latitude: 13.08, longitude: 80.27 },
                'Mumbai': { latitude: 19.07, longitude: 72.87 },
                'Bangalore': { latitude: 12.97, longitude: 77.59 },
                'Delhi': { latitude: 28.61, longitude: 77.20 },
                'Hyderabad': { latitude: 17.38, longitude: 78.48 }
            };
            return fallbacks[city] || fallbacks['Chennai'];
        }
    }

    // 2. Get Weather Forecast (Weekly/Hourly)
    static async getWeatherForecast(lat, lon) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&timezone=Asia/Kolkata`;
            const resp = await axios.get(url);
            return resp.data.hourly;
        } catch (error) {
            console.error("Weather Forecast Error:", error.message);
            return null;
        }
    }

    // 3. Get Air Quality
    static async getAirQuality(lat, lon) {
        try {
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,european_aqi`;
            const resp = await axios.get(url);
            return resp.data.hourly;
        } catch (error) {
            console.error("AQI Error:", error.message);
            return null;
        }
    }

    // 4. Combined Risk Profile Fetches
    static async getLiveRiskData(city) {
        const coords = await this.getCoordinates(city);

        const [weather, airQuality] = await Promise.all([
            this.getWeatherForecast(coords.latitude, coords.longitude),
            this.getAirQuality(coords.latitude, coords.longitude)
        ]);

        // Simple analysis of the next 24 hours
        let maxTemp = 0;
        let totalRain = 0;
        let maxAqi = 0;

        if (weather && weather.temperature_2m) {
            const next24Temps = weather.temperature_2m.slice(0, 24);
            const next24Rain = weather.precipitation.slice(0, 24);
            maxTemp = Math.max(...next24Temps);
            totalRain = next24Rain.reduce((a, b) => a + b, 0);
        }

        if (airQuality && airQuality.european_aqi) {
            const next24Aqi = airQuality.european_aqi.slice(0, 24).filter(v => v !== null); // sometimes null
            if (next24Aqi.length > 0) {
                maxAqi = Math.max(...next24Aqi);
            }
        }

        return {
            maxTemp,
            totalRain,
            maxAqi
        };
    }
}

module.exports = WeatherService;
