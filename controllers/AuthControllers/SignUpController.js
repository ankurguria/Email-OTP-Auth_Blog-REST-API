const User = require('../../models/User')
const Otp = require('../../models/Otp')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    verifyOtp: async (req, res) => {

        const { otp } = req.body;
        const email = req.user.email;
        console.log(email, otp);
        try {
            // If email not found in OTP table, means OTP has expired; regenerate OTP
            const userOtp = await Otp.findOne({ email: email });
            if (!userOtp) {
                return res.status(401).json("Generate OTP again!");
            }
            // // Compare stored (for 5 minutes) OTP and entered OTP 
            const validUser = await bcrypt.compare(otp, userOtp.otp);
            if (!validUser) {
                return res.status(400).json("Authentication failed. Wrong OTP!");
            }
            // Prepare a token
            const payload = { email: email };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "3d" // This token expires in 3 days 
                }
            );
            
            // // Email already verified
            const user = await User.findOne({ email: email });
            if (user) {
                return res.status(200).json({
                    message: "Email already verified!",
                    token: token,
                    userData: user
                });
            }

            // // Create user with verified email address (profile has not been created yet)
            const newUser = new User({ email: email, emailVerification: 'VERIFIED' });
            await newUser.save();
            
            res.status(200).json({
                message: "Email verified!",
                token: token,
                userData: newUser
            });

        } catch (err) {
            res.status(500).json({
                message: "Something went wrong. Try again!",
                error: err,
            });
        }
    },
    signup: async (req, res) => {

        const email = req.user.email;
        try {
            // If email not present means email not verified; no profile updation allowed
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json("Email ID not verified!");
            }
            // Update user profile; mark profileCreation flag true
            req.body.profileCreated = true;
            const updatedUser = await user.updateOne(
                {
                    $set: req.body,
                },
                { new: true });

            res.status(200).json({
                message: "User profile updated!",
                oldUserData: user
            });
        } catch (err) {
            res.status(500).json({
                message: "User not found!",
                error: err,
            });
        }
    }
}
