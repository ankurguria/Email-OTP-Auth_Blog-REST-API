const User = require("../../models/User");
const Otp = require("../../models/Otp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

module.exports = {

    getOtp: async (req, res) => {
        const { email } = req.body;

        // Generate an OTP
        const OTP = otpGenerator.generate(6, {
            digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
        });

        try {
            // Hash the OTP before storing in db
            const salt = await bcrypt.genSalt(10);
            const hashedOTP = await bcrypt.hash(OTP.toString(), salt);  

            // Update OTP (if more than 1 OTP generated in 5 minutes) or Save OTP
            const user = await Otp.findOne({ email: email });
            if (user) {
                await user.updateOne({ $set: { otp: hashedOTP } });
            }
            else {
                const otp = new Otp({email: email, otp: hashedOTP});
                await otp.save();
            }
            console.log(OTP);
            // Send OTP over email
            const transporter = nodemailer.createTransport({
                service: process.env.NODEMAILER_HOST,
                auth: {
                    user: process.env.SENDER,
                    pass: process.env.SENDER_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.SENDER,
                to: email,
                subject: OTP + " is your OTP",
                text: "Dear user, this is your one time password: " + OTP,
            };

            // Prepare a token
            const payload = { email: email };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 300 // This token expires in 5 minutes. 
                }
            );
            try {
                const emailInfo = await transporter.sendMail(mailOptions);
                console.log("Message sent: %s", emailInfo.messageId);

                res.status(200).json({
                    message: "OTP sent! Please check your email (spam folder too).",
                    token: token
                });
            } catch (err) {
                res.status(500).json({
                    message: "Email could not be sent. Try again later.",
                    error: err,
                });
            }
            
        } catch (err) {
            res.status(500).json({
                message: "OTP could not be generated. Try again later.",
                error: err,
            });
        }
    },
};
