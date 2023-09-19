const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const createError = require('../utils/customerror/createError');
const sendOtp = require('../utils/twilio-sms-service/smsService');
const userIpValidation = require('../utils/userIpaddressvalidation/userIpValidation');

exports.userRegister = async (req, res, next) => {
    const clientIp = req.ipInfo.ip; // Extract IP address from request
    try {
        const result = userIpValidation(clientIp) // this funciton checks the user ip and if the ip permitted it allows other wise its not if not necessorty it improves the security
        if (result) {
            const {username, email, password, phonenumber} = req.body;
            // accessing the body data for the next procedure


            // Check if the email already exists
            const existingEmail = await User.findOne({email: email});
            if (existingEmail) {
                return next(createError(400, "Email already exists."));
            }


            // Check if the phone already exists
            const existingPhone = await User.findOne({phonenumber: phonenumber});
            if (existingEmail) {
                return next(createError(400, "Email already exists."));
            }

            // Generate OTP
            const otp = await sendOtp(phonenumber);
            // Store OTP and other user data in the session
            console.log(otp)
            req.session.otp = otp;
            req.session.userData = {
                username,
                email,
                password,
                phonenumber
            };
            res.send("the otp send successfully")//after the otp send and the data saved in the session get a successful response
            // res.redirect("/userValidation") //if needed goto the veridyotp page
        } else {
            return next(createError(403, "Access denied. Invalid IP address."))
        }
    } catch (error) {
        next(error)
    }
},

exports.userValidation = async (req, res, next) => {
    try { // Retrieve OTP and other user data from the session
        const storedOtp = req.session.otp;
        const userData = req.session.userData;

        // Retrieve the OTP entered by the user
        const enteredOtp = req.body.otp;

        // Compare the entered OTP with the stored OTP
        if (enteredOtp === storedOtp) {
            // OTP is valid, proceed with user registration

            // Save user data to MongoDB and encrypt the password
            const {username, email, password, phonenumber} = userData;

            // You can use a library like bcrypt to hash the password before saving it
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create a new User document and save it to the database
            const newUser = new User({
                username, email, password: hashedPassword, // Store the hashed password
                phonenumber
            });

            await newUser.save();
            // Save the user document to MongoDB

            // Clear the OTP and user data from the session
            delete req.session.otp;
            delete req.session.userData;

            // Respond with a success message or redirect to a success page
            res.send('User registration successfully completed');
        } else { // OTP is invalid, respond with an error message or redirect to the OTP verification page
            return next(createError(400, 'Invalid OTP. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};
