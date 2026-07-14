const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register Page
exports.registerPage = (req, res) => {
    res.render("signup");
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