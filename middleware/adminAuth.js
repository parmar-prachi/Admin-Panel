const Admin = require("../models/Admin");


exports.isAdmin = async (req, res, next) => {


    try {


        if (!req.session.admin) {

            return res.redirect("/admin/login");

        }


        const admin = await Admin.findById(
            req.session.admin._id
        );


        if (!admin) {

            return res.redirect("/admin/login");

        }


        req.admin = admin;


        next();



    } catch (err) {

        console.log(err);

        res.redirect("/admin/login");

    }


};