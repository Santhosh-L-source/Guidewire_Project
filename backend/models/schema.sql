CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  city TEXT NOT NULL,
  zone TEXT NOT NULL,
  platform TEXT NOT NULL,
  weekly_earnings REAL NOT NULL,
  experience_years INTEGER NOT NULL,
  risk_score INTEGER,
  risk_tier TEXT,
  recommended_plan TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL,
  plan_name TEXT NOT NULL,
  weekly_premium REAL NOT NULL,
  coverage_amount REAL NOT NULL,
  valid_from DATETIME NOT NULL,
  valid_to DATETIME NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(worker_id) REFERENCES workers(id)
);

CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  payout_amount REAL NOT NULL,
  fraud_score INTEGER,
  status TEXT DEFAULT 'UNDER REVIEW',
  rejection_reason TEXT,
  transaction_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(worker_id) REFERENCES workers(id)
);

CREATE TABLE IF NOT EXISTS trigger_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  severity TEXT,
  event_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Workers Demo Data
INSERT OR IGNORE INTO workers (id, name, phone, password, city, zone, platform, weekly_earnings, experience_years, risk_score, risk_tier, recommended_plan)
VALUES 
(1, 'Rajesh Kumar', '9876543210', '$2b$10$XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1X', 'Chennai', 'Velachery', 'Zomato', 3500, 3, 40, 'Medium', 'Standard'),
(2, 'Suresh', '9876543211', '$2b$10$XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1X', 'Bangalore', 'Koramangala', 'Swiggy', 4000, 5, 20, 'Low', 'Basic'),
(3, 'Amit Singh', '9876543212', '$2b$10$XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1X', 'Delhi', 'Connaught Place', 'Zomato', 5000, 2, 70, 'High', 'Premium'),
(4, 'Mahesh', '9876543213', '$2b$10$XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1X', 'Mumbai', 'Andheri', 'Swiggy', 4500, 4, 30, 'Low', 'Basic'),
(5, 'Venkat', '9876543214', '$2b$10$XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1XQO1X', 'Hyderabad', 'HITEC City', 'Zomato', 3800, 1, 55, 'Medium', 'Standard');

-- Seed Policies for Demo
INSERT OR IGNORE INTO policies (id, worker_id, plan_name, weekly_premium, coverage_amount, valid_from, valid_to, status)
VALUES
(1, 1, 'Standard', 49, 1000, datetime('now', '-2 days'), datetime('now', '+5 days'), 'ACTIVE'),
(2, 2, 'Basic', 29, 500, datetime('now', '-3 days'), datetime('now', '+4 days'), 'ACTIVE'),
(3, 3, 'Premium', 79, 2000, datetime('now', '-1 days'), datetime('now', '+6 days'), 'ACTIVE');

-- Seed Past Claims for Demo
INSERT OR IGNORE INTO claims (id, worker_id, trigger_type, payout_amount, fraud_score, status, transaction_id, created_at)
VALUES
(1, 1, 'HEAVY RAIN', 85.71, 0, 'APPROVED', 'TXN_123456789', datetime('now', '-10 days')),
(2, 3, 'EXTREME HEAT', 285.71, 10, 'APPROVED', 'TXN_123456790', datetime('now', '-5 days'));

-- Seed Past Trigger Events
INSERT OR IGNORE INTO trigger_events (id, city, trigger_type, severity, event_data, created_at)
VALUES
(1, 'Chennai', 'HEAVY RAIN', 'High', '{"precip": 15}', datetime('now', '-10 days')),
(2, 'Delhi', 'EXTREME HEAT', 'Extreme', '{"temp": 43.5}', datetime('now', '-5 days'));
