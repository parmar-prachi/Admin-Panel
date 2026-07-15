const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register Page
exports.registerPage = (req, res) => {
    res.render("signup");
};
// Register
exports.register = async (req, res) => {

    try {

        const email = req.body.email.trim().toLowerCase();
        const username = req.body.username.trim();

        // Check Email
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            req.flash("error", "Email already exists.");
            return res.redirect("/signup");
        }

        // Check Username
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            req.flash("error", "Username already exists.");
            return res.redirect("/signup");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({

            firstName: req.body.firstName,

            lastName: req.body.lastName,

            username,

            email,

            password: hashedPassword,

            role

        });

        req.flash("success", "Registration successful. Please login.");

        return res.redirect("/login");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/signup");

    }

};
// Login Page
exports.loginPage = (req, res) => {
    res.render("login");
};

// Login
exports.login = (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {

            if (err) {
                return next(err);
            }

            console.log("Logged In User:", req.user);

            return res.redirect("/dashboard");

        });

    })(req, res, next);

};

// Logout
exports.logout = (req, res, next) => {

    req.logout(function (err) {

        if (err) {
            return next(err);
        }

        req.session.destroy(() => {

            res.clearCookie("connect.sid");

            res.redirect("/login");

        });

    });

};