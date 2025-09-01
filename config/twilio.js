const twilio = require('twilio');

// Load Twilio errors
const twilioErrors = require('../twillioerror.json');

// Twilio configuration
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  serviceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  testMode: process.env.TWILIO_TEST_MODE === 'true',
  staticOtp: process.env.STATIC_OTP || '123456'
};

// Initialize Twilio client
let twilioClient = null;

if (twilioConfig.accountSid && twilioConfig.authToken) {
  twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);
}

/**
 * Send verification code using Twilio Verify
 * @param {string} phone - Phone number with country code
 * @param {string} countryCode - Country code
 * @returns {Promise<Object>} - Send result
 */
const sendVerification = async (phone, countryCode = '') => {
  try {
    // If in test mode, just log and return success
    if (twilioConfig.testMode) {
      console.log(`🧪 TEST MODE: Verification would be sent to ${countryCode}${phone}`);
      console.log(`📱 Static OTP for testing: ${twilioConfig.staticOtp}`);
      return {
        success: true,
        status: 'pending',
        sid: 'test-verification-sid'
      };
    }

    // Check if Twilio client is available
    if (!twilioClient) {
      throw new Error('Twilio client not configured');
    }

    // Send verification via Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(twilioConfig.serviceSid)
      .verifications.create({
        channel: "sms",
        to: `${countryCode}${phone}`,
      });

    return {
      success: true,
      status: verification.status,
      sid: verification.sid
    };

  } catch (error) {
    console.error('Twilio verification error:', error);
    
    // Handle Twilio errors
    if (twilioErrors.length > 0) {
      for (const twilioError of twilioErrors) {
        if (error && error.code && error.code === twilioError.code) {
          throw new Error(twilioError.message || 'Twilio verification failed');
        }
      }
    }
    
    throw new Error('Failed to send verification code');
  }
};

/**
 * Verify OTP code using Twilio Verify
 * @param {string} phone - Phone number with country code
 * @param {string} code - Verification code
 * @param {string} countryCode - Country code
 * @returns {Promise<Object>} - Verification result
 */
const verifyCode = async (phone, code, countryCode = '') => {
  try {
    // If in test mode, accept static OTP
    if (twilioConfig.testMode) {
      if (code === twilioConfig.staticOtp) {
        return {
          success: true,
          status: 'approved',
          sid: 'test-verification-check-sid'
        };
      } else {
        return {
          success: false,
          status: 'pending',
          sid: 'test-verification-check-sid'
        };
      }
    }

    // Check if Twilio client is available
    if (!twilioClient) {
      throw new Error('Twilio client not configured');
    }

    // Verify code via Twilio Verify
    const verificationCheck = await twilioClient.verify.v2
      .services(twilioConfig.serviceSid)
      .verificationChecks.create({
        code: code,
        to: `${countryCode}${phone}`,
      });

    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      sid: verificationCheck.sid
    };

  } catch (error) {
    console.error('Twilio verification check error:', error);
    
    // Handle Twilio errors
    if (twilioErrors.length > 0) {
      for (const twilioError of twilioErrors) {
        if (error && error.code && error.code === twilioError.code) {
          throw new Error(twilioError.message || 'Twilio verification failed');
        }
      }
    }
    
    throw new Error('Failed to verify code');
  }
};

/**
 * Get Twilio error message by code
 * @param {number} code - Twilio error code
 * @returns {string} - Error message
 */
const getTwilioErrorMessage = (code) => {
  const error = twilioErrors.find(err => err.code === code);
  return error ? error.message : 'Unknown Twilio error';
};

module.exports = {
  sendVerification,
  verifyCode,
  getTwilioErrorMessage,
  twilioConfig,
  twilioErrors
};
