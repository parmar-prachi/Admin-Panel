const express = require("express");
const router = express.Router();

const passwordController = require("../controllers/passwordController");

router.get("/forgot-password", passwordController.forgotPasswordPage);

router.post("/forgot-password", passwordController.sendOtp);

router.get("/verify-otp", passwordController.verifyOtpPage);

router.post("/verify-otp", passwordController.verifyOtp);

router.get(
    "/reset-password/:id",
    passwordController.resetPasswordPage
);

router.post(
    "/reset-password/:id",
    passwordController.resetPassword
);

module.exports = router;