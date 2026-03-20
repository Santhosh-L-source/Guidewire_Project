// backend/services/notificationService.js
// Simple simulated notification via console.log (can be replaced with real provider)

function sendNotification({ to, message, channel = 'SMS' }) {
  // In a real implementation, integrate with Twilio, WhatsApp API, etc.
  // For demo, just log to console with a distinctive prefix.
  console.log(`[NOTIFICATION] Channel: ${channel} | To: ${to} | Message: ${message}`);
  // Return a mock result
  return { success: true, channel, to };
}

module.exports = { sendNotification };
