const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: 300 }
        }
        // After 5 minutes OTP is automatically deleted from the database
    },
    { timestamps: true }
);


module.exports = mongoose.model("Otp", OtpSchema);
