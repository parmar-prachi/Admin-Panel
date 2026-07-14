const User = require("../models/User");
const bcrypt = require("bcryptjs");

// View Profile
exports.profile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        res.render("profile", { user });

    } catch (err) {
        console.log(err);
        res.redirect("/dashboard");
    }
};

// Edit Profile Page
exports.editProfilePage = async (req, res) => {
    try {
        console.log("Rendering editProfile page...");

        const user = await User.findById(req.user._id);

        res.render("editProfile", { user });


    } catch (err) {
        console.log(err);
        res.render("profile");
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {

    const updateData = {
        mobile: req.body.mobile,
        gender: req.body.gender,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        education: req.body.education,
        occupation: req.body.occupation,
        status: req.body.status,
        dob: req.body.dob,
        age: req.body.age,
        hobbies: req.body.hobbies
            ? req.body.hobbies.split(",").map(h => h.trim())
            : []
    };

    if (req.file) {
        updateData.image = "users/" + req.file.filename;
    }

    await User.findByIdAndUpdate(req.user._id, updateData);

    req.flash("success", "Profile updated successfully!");

    res.redirect("/profile");
};

// Change Password Page

exports.changePasswordPage = (req, res) => {

    res.render("changePassword");

};

// Change Password


exports.changePassword = async (req, res) => {

    try {

        const {

            currentPassword,
            newPassword,
            confirmPassword

        } = req.body;

        const user = await User.findById(req.user._id);

        // Check current password

        const match = await bcrypt.compare(

            currentPassword,
            user.password

        );

        if (!match) {

            req.flash("error", "Current password is incorrect.");

            return res.redirect("/profile/change-password");    

        }

        // Check confirm password

        if (newPassword !== confirmPassword) {

            req.flash("error", "New password and confirm password do not match.");

            return res.redirect("/profile/change-password");

        }

        // Hash new password

        const hashedPassword = await bcrypt.hash(

            newPassword,
            10

        );

        // Update password

        await User.findByIdAndUpdate(

            req.user._id,

            {

                password: hashedPassword

            }

        );

        // Logout user

        req.logout(function (err) {

            if (err) {

                return res.send(err);

            }

            req.session.destroy(() => {

                res.redirect("/login");

            });

        });

    }

    catch (err) {

        console.log(err);

        req.flash("success", "Profile updated successfully!");

        res.redirect("/profile");

    }

};