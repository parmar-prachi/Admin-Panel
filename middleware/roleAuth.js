module.exports = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send("Access Denied ❌");
        }

        next();

    };

};