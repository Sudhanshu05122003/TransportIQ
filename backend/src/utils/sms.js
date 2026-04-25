/**
 * SMS Utility for TransportIQ
 * Supports MSG91 for Indian numbers and has a mock fallback for development
 */
const axios = require('axios');

const sendSMS = async (phone, message) => {
  console.log(`[SMS] Sending to ${phone}: ${message}`);

  // Mock fallback for development or if no auth key is provided
  if (process.env.NODE_ENV !== 'production' || !process.env.MSG91_AUTH_KEY) {
    return { success: true, message: 'SMS sent successfully (Mock)', provider: 'mock' };
  }

  try {
    // MSG91 API Implementation
    const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
      template_id: process.env.MSG91_TEMPLATE_ID,
      sender: process.env.MSG91_SENDER_ID || 'TRNSIQ',
      short_url: '0',
      mobiles: phone.startsWith('91') ? phone : `91${phone}`,
      var: message // Assuming template has one variable for message or OTP
    }, {
      headers: {
        'authkey': process.env.MSG91_AUTH_KEY,
        'content-type': 'application/json'
      }
    });

    return { success: true, data: response.data, provider: 'msg91' };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

const sendOTP = async (phone, otp) => {
  const message = `Your TransportIQ verification code is ${otp}. Valid for 5 minutes.`;
  return await sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendOTP
};
