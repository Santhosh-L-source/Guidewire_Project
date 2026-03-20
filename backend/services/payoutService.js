// backend/services/payoutService.js
// Simulated Razorpay test mode payout (no real money transfer)
const Razorpay = require('razorpay');

// Razorpay test credentials (demo only)
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_XXXXXXXXXXXXXXXX', // replace with your test key
  key_secret: 'test_secret'
});

/**
 * Simulate a payout to a worker's UPI or bank account.
 * Returns a promise that resolves with a mock receipt object.
 */
async function payout({ amount, workerId, method = 'UPI', note = '' }) {
  // Razorpay test mode does not actually transfer funds, but we can create a payment capture.
  // We'll create a dummy order and capture it instantly.
  const order = await razorpayInstance.orders.create({
    amount: amount * 100, // amount in paise
    currency: 'INR',
    receipt: `payout_${workerId}_${Date.now()}`,
    notes: { method, note }
  });

  // Capture the payment (simulated)
  await razorpayInstance.payments.capture(order.id, order.amount, 'INR');

  // Return a mock receipt
  return {
    transactionId: order.id,
    amount,
    method,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  };
}

module.exports = { payout };
