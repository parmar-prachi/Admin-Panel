const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const upload = require("../config/multer");

const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

// Add User
router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    userController.addUser
);

router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    userController.insertUser
);

// View Users
router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    userController.viewUsers
);

// Single User
router.get(
    "/view/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    userController.getSingleUser
);

// Edit User
router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    userController.editUser
);

router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    userController.updateUser
);

// Delete User
router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin"),
    userController.deleteUser
);

module.exports = router;