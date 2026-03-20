const db = require('./models/db');
const bcrypt = require('bcrypt');

const cities = ['Chennai', 'Mumbai', 'Bangalore'];
const platforms = ['Zomato', 'Swiggy'];
const zones = ['North', 'South', 'East', 'West', 'Central'];

async function generateWorkers() {
    const defaultPassword = await bcrypt.hash('password', 10);
    
    console.log("Seeding 50 mock workers...");
    
    const insertWorker = db.prepare(`INSERT INTO workers (phone, password, name, city, zone, platform, weekly_earnings, experience_years, risk_tier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    const insertMany = db.transaction(() => {
        for (let i = 10; i <= 60; i++) {
            const phone = `9999900${i.toString().padStart(2, '0')}`;
            const name = `Mock Worker ${i}`;
            const city = cities[Math.floor(Math.random() * cities.length)];
            const zone = `${city} ${zones[Math.floor(Math.random() * zones.length)]}`;
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const earnings = 2000 + (Math.random() * 5000);
            const exp = Math.floor(Math.random() * 5) + 1;
            const riskTier = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
            
            insertWorker.run(phone, defaultPassword, name, city, zone, platform, earnings.toFixed(0), exp, riskTier);
        }
    });
    
    try {
        insertMany();
        console.log("Successfully inserted 50 mock workers.");
    } catch (err) {
        console.error("Error seeding:", err.message);
    }
}

generateWorkers();
