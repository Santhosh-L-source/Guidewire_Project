const jwt = require('jsonwebtoken');
const axios = require('axios');

const SECRET = 'gigshield_secret_key_demo';
const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1d' });

async function testAdmin() {
    try {
        console.log("Fetching Overview...");
        const res1 = await axios.get('http://localhost:5000/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } });
        console.log("Overview Data:", res1.data);

        console.log("Fetching Claims...");
        const res2 = await axios.get('http://localhost:5000/api/claims', { headers: { Authorization: `Bearer ${token}` } });
        console.log("Claims Data:", res2.data.length, "rows");
    } catch (e) {
        console.error("ERROR:", e.response ? e.response.data : e.message);
    }
}
testAdmin();
