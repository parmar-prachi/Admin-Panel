module.exports = (...allowedRoles) => {

    return (req, res, next) => {

        // Check Passport authentication
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        // Check user role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send("Access Denied ❌");
        }

        next();
    };

};