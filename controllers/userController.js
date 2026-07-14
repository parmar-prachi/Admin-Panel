const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../uploads/users");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}




exports.addUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            return res.redirect("/login");
        }

        res.render("add", {
            user: currentUser   
        });

    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};


exports.insertUser = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            req.flash("error", "User not found.");
            return res.redirect("/login");

        }

        // Update Profile
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.mobile = req.body.mobile || user.mobile;
        user.gender = req.body.gender || user.gender;
        user.dob = req.body.dob || user.dob;
        user.age = req.body.age || user.age;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.pincode = req.body.pincode || user.pincode;
        user.education = req.body.education || user.education;
        user.occupation = req.body.occupation || user.occupation;
        user.joiningDate = req.body.joiningDate || user.joiningDate;
        user.status = req.body.status || user.status;

        user.hobbies = req.body.hobbies
            ? req.body.hobbies.split(",").map(h => h.trim())
            : user.hobbies;

        // Update Image
        if (req.file) {

            if (user.image && user.image !== "default.png") {

                const imagePath = path.join(
                    __dirname,
                    "../uploads/users",
                    user.image
                );

                if (fs.existsSync(imagePath)) {

                    fs.unlinkSync(imagePath);

                }

            }

            user.image = req.file.filename;

        }

        await user.save();

        req.flash("success", "Profile updated successfully.");

        res.redirect("/dashboard");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("back");

    }

};


// VIEW ALL USERS

exports.viewUsers = async (req, res) => {
    try {

        const search = req.query.search || "";

        const users = await User.find({
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        res.render("table", { users, search });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// SINGLE USER

exports.getSingleUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            req.flash("error", "User not found.");

            return res.redirect("/login");
        }

        res.render("view", { user });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};


// EDIT USER PAGE

exports.editUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect("/users");
        }

        res.render("edit", { user });

    } catch (err) {
        console.log(err);
        res.redirect("/users");
    }
};


// UPDATE USER

exports.updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            req.flash("error", "User not found.");
            return res.redirect("/users");

        }


        // Check duplicate username
        const existingUsername = await User.findOne({
            username: req.body.username.trim(),
            _id: { $ne: req.params.id }
        });

        if (existingUsername) {

            req.flash("error", "Username already exists.");
            return res.redirect("back");

        }


        // Check duplicate email
        const existingEmail = await User.findOne({
            email: req.body.email.trim().toLowerCase(),
            _id: { $ne: req.params.id }
        });

        if (existingEmail) {

            req.flash("error", "Email already exists.");
            return res.redirect("back");

        }


        // Update fields
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.gender = req.body.gender || user.gender;
        user.dob = req.body.dob || user.dob;
        user.age = req.body.age || user.age;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.pincode = req.body.pincode || user.pincode;
        user.education = req.body.education || user.education;
        user.occupation = req.body.occupation || user.occupation;
        user.joiningDate = req.body.joiningDate || user.joiningDate;
        user.status = req.body.status || user.status;

        // Only Super Admin can change role
        if (req.user.role === "Super Admin") {
            user.role = req.body.role || user.role;
        }

        // Hobbies
        user.hobbies = req.body.hobbies
            ? req.body.hobbies.split(",").map(h => h.trim())
            : user.hobbies;


        // Update Image
        if (req.file) {

            if (user.image && user.image !== "default.png") {

                const imagePath = path.join(
                    __dirname,
                    "../uploads/users",
                    user.image
                );

                if (fs.existsSync(imagePath)) {

                    fs.unlinkSync(imagePath);

                }

            }

            user.image = req.file.filename;

        }


        await user.save();

        req.flash("success", "User updated successfully.");

        res.redirect("/users");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("back");

    }

};

// DELETE USER

exports.deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect("/users");
        }

        if (user.image && user.image !== "default.png") {

            const imagePath = path.join(
                __dirname,
                "../uploads/users",
                user.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await User.findByIdAndDelete(req.params.id);

        res.redirect("/users");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};