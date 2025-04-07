const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendVerificationCode = async (phoneNumber) => {
  try {
    // Create verification
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: phoneNumber.includes("+") ? phoneNumber : `+1${phoneNumber}`,
        channel: "sms",
        time_to_live: 10,
        // messagingServiceSid: process.env.SMS_SERVICE_SID,
      }); 
    if (verification.status === "pending") {
      return {
        status: "success",
      };
    } else {
      return {
        status: "error",
        error: "Failed to send verification code",
      };
    }
  } catch (error) {
    console.log(error);
    if (error.code === 60200) {
      return {
        status: "invalid",
        error: "Invalid phone number",
      };
    }
    return {
      status: "error",
      error: error.message,
    };
  }
};

const verifyCode = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: phoneNumber.includes("+") ? phoneNumber : `+1${phoneNumber}`,
        code: code,
      });
    // console.log(verificationCheck);
    if (verificationCheck.status === "approved") {
      return {
        status: "success",
      };
    } else {
      return {
        status: "error",
        error: "Invalid code",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      error: error.message,
    };
  }
};

module.exports = {
  sendVerificationCode,
  verifyCode,
};
