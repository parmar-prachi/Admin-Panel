const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../uploads/users");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

exports.addUser = (req, res) => {

    res.render("add");

};

exports.insertUser = async (req, res) => {
    try {

        // Permission Check
        if (!permission.canCreateUser(req.user.role, req.body.role)) {
            req.flash("error", "Access Denied.");
            return res.redirect("/users");
        }

        // Get Form Data
        const username = (req.body.username || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();

        // Check Username
        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            req.flash("error", "Username already exists.");
            return res.redirect("/users");
        }

        // Check Email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            req.flash("error", "Email already exists.");
            return res.redirect("/users");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Upload Image
        let image = "default.png";

        if (req.file) {
            image = req.file.filename;
        }

        // Create User
        await User.create({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username,
            email,
            password: hashedPassword,

            role: req.body.role,

            mobile: req.body.mobile,
            gender: req.body.gender,
            dob: req.body.dob || null,
            age: req.body.age || null,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            education: req.body.education,
            occupation: req.body.occupation,
            joiningDate: req.body.joiningDate || Date.now(),
            status: req.body.status || "Active",
            image,

            hobbies: req.body.hobbies
                ? req.body.hobbies.split(",").map(h => h.trim())
                : []

        });

        req.flash("success", "User created successfully.");

        return res.redirect("/users");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/users");

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

            return res.redirect("/users");

        }

        // Permission Check
        if (!permission.canEditUser(req.user.role, user.role)) {

            req.flash("error", "Access Denied");

            return res.redirect("/users");

        }

        res.render("view", { user });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/users");

    }

};

// EDIT USER PAGE

exports.editUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/users");

        }

        // Permission Check
        if (!permission.canEditUser(req.user.role, user.role)) {

            req.flash("error", "Access Denied");

            return res.redirect("/users");

        }

        res.render("edit", { user });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/users");

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

        // Permission Check
        if (!permission.canEditUser(req.user.role, user.role)) {

            req.flash("error", "Access Denied");

            return res.redirect("/users");

        }

        const username = (req.body.username || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();

        // Duplicate Username
        const usernameExists = await User.findOne({
            username,
            _id: { $ne: user._id }
        });

        if (usernameExists) {

            req.flash("error", "Username already exists.");

            return res.redirect("/users");

        }

        // Duplicate Email
        const emailExists = await User.findOne({
            email,
            _id: { $ne: user._id }
        });

        if (emailExists) {

            req.flash("error", "Email already exists.");

            return res.redirect("/users");

        }

        // Update Fields

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.username = username;
        user.email = email;
        user.mobile = req.body.mobile;
        user.gender = req.body.gender;
        user.dob = req.body.dob;
        user.age = req.body.age;
        user.address = req.body.address;
        user.city = req.body.city;
        user.state = req.body.state;
        user.pincode = req.body.pincode;
        user.education = req.body.education;
        user.occupation = req.body.occupation;
        user.joiningDate = req.body.joiningDate;
        user.status = req.body.status;

        // Change Role (only if allowed)

        if (permission.canCreateUser(req.user.role, req.body.role)) {

            user.role = req.body.role;

        }

        // Hobbies

        user.hobbies = req.body.hobbies
            ? req.body.hobbies.split(",").map(h => h.trim())
            : [];

        // Image Upload

        if (req.file) {

            if (
                user.image &&
                user.image !== "default.png"
            ) {

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

        return res.redirect("/users");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/users");

    }

};

// DELETE USER

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/users");

        }

        // Permission Check
        if (!permission.canDeleteUser(req.user.role, user.role)) {

            req.flash("error", "Access Denied");

            return res.redirect("/users");

        }

        // Delete Profile Image

        if (
            user.image &&
            user.image !== "default.png"
        ) {

            const imagePath = path.join(
                __dirname,
                "../uploads/users",
                user.image
            );

            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);

            }

        }

        await User.findByIdAndDelete(user._id);

        req.flash("success", "User deleted successfully.");

        return res.redirect("/users");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/users");

    }

};