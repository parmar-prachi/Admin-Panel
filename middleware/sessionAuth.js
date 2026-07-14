module.exports = (req, res, next) => {


    console.log("User:", req.user);

    console.log("Admin:", req.session.admin);



    // Normal User Login (Passport)
    if (req.isAuthenticated && req.isAuthenticated()) {

        return next();

    }

    // Admin Login
    if (req.session.admin) {

        return next();

    }



    return res.redirect("/login");


};