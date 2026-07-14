const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");


// ADMIN LIST

exports.index = async (req, res) => {

    try {

        const admins = await Admin.find();

        res.render("admin/table", {
            admins
        });


    } catch (err) {

        console.log(err);

    }

};




// ADD PAGE

exports.addPage = (req, res) => {

    res.render("admin/add");

};




// ADD ADMIN

exports.add = async (req, res) => {

    try {


        const hashPassword = await bcrypt.hash(
            req.body.password,
            10
        );


        await Admin.create({

            firstName: req.body.firstName,

            lastName: req.body.lastName,

            email: req.body.email,

            password: hashPassword,

            mobile: req.body.mobile,

            role: req.body.role,

            status: req.body.status

        });



        res.redirect("/admin");


    } catch (err) {

        console.log(err);

    }

};





// DELETE ADMIN

exports.delete = async (req, res) => {

    try {

        await Admin.findByIdAndDelete(req.params.id);


        res.redirect("/admin");


    } catch (err) {

        console.log(err);

    }

};
// EDIT PAGE

exports.editPage = async (req, res) => {

    try {


        const admin = await Admin.findById(req.params.id);


        res.render("admin/edit", {
            admin
        });


    } catch (err) {

        console.log(err);

    }

};





// UPDATE ADMIN

exports.update = async (req, res) => {


    try {


        await Admin.findByIdAndUpdate(

            req.params.id,

            {

                firstName: req.body.firstName,

                lastName: req.body.lastName,

                email: req.body.email,

                mobile: req.body.mobile,

                role: req.body.role,

                status: req.body.status

            }

        );


        res.redirect("/admin");


    } catch (err) {

        console.log(err);

    }


};

// LOGIN PAGE

exports.loginPage = (req, res) => {

    res.render("admin/login");

};




// LOGIN

exports.login = async (req, res) => {

    try {

        const admin = await Admin.findOne({
            email: req.body.email
        });


        if (!admin) {

            return res.send("Admin not found");

        }


        const match = await bcrypt.compare(
            req.body.password,
            admin.password
        );


        if (!match) {

            return res.send("Wrong Password");

        }


        req.session.admin = {
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role
        };

        console.log("Admin Session:", req.session.admin);
        res.redirect("/dashboard");


    } catch (err) {

        console.log(err);

    }

};
// ADMIN DASHBOARD

exports.dashboard = (req, res) => {

    res.render("dashboard");

};
// ADMIN LOGOUT

exports.logout = (req, res) => {


    req.session.destroy((err) => {


        if (err) {

            console.log(err);

            return res.redirect("/dashboard");

        }


        res.redirect("/admin/login");


    });


};