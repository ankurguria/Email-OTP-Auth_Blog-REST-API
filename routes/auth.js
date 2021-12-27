const express = require('express');
const router = express.Router();
const GetOtpController = require('../controllers/AuthControllers/GetOtpController');
const SignUpController = require('../controllers/AuthControllers/SignUpController');
const LogInController = require('../controllers/AuthControllers/LogInController');
const verifyToken = require("../middlewares/verifyToken");


router.post('/getotp', GetOtpController.getOtp);
router.post('/signup/', verifyToken, SignUpController.signup);
router.post('/signup/verifyotp', verifyToken, SignUpController.verifyOtp);
router.post('/login', verifyToken, LogInController.login);


module.exports = router;