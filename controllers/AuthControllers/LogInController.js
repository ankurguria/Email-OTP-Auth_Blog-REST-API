const User = require('../../models/User')
const Otp = require('../../models/Otp')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    login: async (req, res) => {

        const { otp } = req.body;
        const email = req.user.email;
        try {
            // Find corresponding OTP; not found means OTP expired
            const userOtp = await Otp.findOne({ email: email });
            if (!userOtp) {
                return res.status(401).json("Generate OTP again!");
            }
            // Compare stored (for 5 minutes) OTP and entered OTP 
            const validUser = await bcrypt.compare(otp, userOtp.otp);
            if (!validUser) {
                return res.status(400).json("Authentication failed. Wrong OTP!");
            }

            // Find user with the email address
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(400).json("This email ID is not registered!");
            }
            // if profile not created; login not allowed; should signup/create profile first
            if (!user.profileCreated) {
                return res.status(401).json(
                    "User profile hasn't been created/filled. Please signup to create profile first!"
                );
            }

            // Prepare a token
            const payload = { id: user._id };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "3d" // This token expires in 3 days. 
                }
            );

            res.status(200).json({
                message: "You are logged in!",
                token: token,
                userData: user
            });

        } catch (err) {
            res.status(500).json({
                message: "Something went wrong. Try again!",
                error: err,
            });
        }
    }
}
