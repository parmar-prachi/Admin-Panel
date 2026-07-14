const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");


// Local Strategy


passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {

            try {

                email = email.trim().toLowerCase();

                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, {
                        message: "Email not found"
                    });
                }

                const match = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!match) {
                    return done(null, false, {
                        message: "Wrong Password"
                    });
                }

                return done(null, user);

            } catch (err) {

                return done(err);

            }

        }
    )
);


// Serialize User


passport.serializeUser((user, done) => {

    done(null, user.id);

});


// Deserialize User


passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id);

        done(null, user);

    } catch (err) {

        done(err);

    }

});

module.exports = passport;