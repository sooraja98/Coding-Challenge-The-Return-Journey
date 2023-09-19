const createError = require('../customerror/createError');
const { TWILIO_PHONE_NUMBER, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOtp = async (phonenumber) => {
    try {
        // Ensure that the phone number has the country code "+91"
        const formattedPhoneNumber = `+91${phonenumber}`;

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send the OTP via SMS using Twilio
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            messagingServiceSid: TWILIO_SERVICE_SID,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhoneNumber, // Use the formatted phone number
        });

        // Log the SMS sent and the OTP generated
        console.log(`SMS sent to ${formattedPhoneNumber}: ${message.sid}`);
        console.log(`Generated OTP: ${otp}`);
        // Return the OTP in case you want to verify it later
        return otp;
    } catch (error) {
        console.error("TWILIO ERROR:", error.message);
        throw createError(500, 'Twilio service error');
    }
};

module.exports = sendOtp;
