const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models/db');
const TriggerMonitor = require('./services/triggerMonitor');

const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');
const claimsRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');
const policiesRoutes = require('./routes/policies');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes.router);
app.use('/api/claims', claimsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/policies', policiesRoutes);

app.get('/', (req, res) => {
    res.send('GigShield API is running');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    // Start the background trigger monitor
    TriggerMonitor.startMonitoring();
});
