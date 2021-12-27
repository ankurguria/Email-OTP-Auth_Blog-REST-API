const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: false,
    },
    lastName: {
      type: String,
      trim: true,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    // email verified (atleast 1) through OTP or not
    emailVerification: {   
      type: String,
      enum: ['VERIFIED', 'NOT VERIFIED'],
      default: 'NOT VERIFIED'
    },
    // email might be verified but profile (firstname & last name) might not be created/filled (using /signup)
    profileCreated: { 
      type: Boolean,
      enum: [true, false],
      default: false
    },
    mobile: {
      type: String
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
