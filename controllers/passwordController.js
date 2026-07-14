const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");

// Forgot Password Page
exports.forgotPasswordPage = (req, res) => {
    res.render("forgotPassword");
};

// Send OTP 
exports.sendOtp = async (req, res) => {

    try {

        const email = req.body.email.trim().toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Email not registered ❌");
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP valid for 5 minutes
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        // Save OTP in MongoDB
        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        // Send email
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "Password Reset OTP",

            html: `
                <h2>Full Admin Panel</h2>

                <p>Your Password Reset OTP is:</p>

                <h1 style="color:#6c5dd3">${otp}</h1>

                <p>This OTP will expire in <b>5 minutes</b>.</p>
            `
        });

        res.redirect("/verify-otp");

    } catch (err) {

        console.log(err);
        console.error(err);

        req.flash("error", "Something went wrong. Please try again.");

        return res.redirect("/dashboard");

    }

};
// Verify OTP Page
exports.verifyOtpPage = (req, res) => {
    res.render("verifyOtp");
};

// Verify OTP

exports.verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.send("Email not found ❌");
        }

        // Check OTP
        if (user.otp !== otp) {
            return res.send("Invalid OTP ❌");
        }

        // Check expiry
        if (user.otpExpiry < Date.now()) {
            return res.send("OTP Expired ❌");
        }

        // OTP verified
        res.redirect(`/reset-password/${user._id}`);

    } catch (err) {

        console.log(err);
        res.send("Server Error");

    }

};
// Reset Password Page

exports.resetPasswordPage = (req, res) => {

    res.render("resetPassword", {
        userId: req.params.id
    });

};

// Reset Password

exports.resetPassword = async (req, res) => {

    try {

        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash("error", "New password and confirm password do not match.");

            return res.redirect("/profile/change-password");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(req.params.id, {

            password: hashedPassword,

            otp: null,
            otpExpiry: null

        });

        res.redirect("/login");

    } catch (err) {

        console.log(err);
        res.send("Server Error");

    }

};