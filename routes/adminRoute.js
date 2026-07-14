const express = require("express");
const router = express.Router();
const roleAuth = require("../middleware/roleAuth");

const adminController = require("../controllers/adminController");


// Admin Login Page
router.get(
    "/admin/login",
    adminController.loginPage
);


// Admin Login Submit
router.post(
    "/admin/login",
    adminController.login
);


// Admin List

router.get(
    "/admin",
    roleAuth("Super Admin"),
    adminController.index
);


// Add Admin
router.get(
    "/admin/add",
    roleAuth("Super Admin"),
    adminController.addPage
);


router.post(
    "/admin/add",
    roleAuth("Super Admin"),
    adminController.add
);


// Edit Admin
router.get(
    "/admin/edit/:id",
    roleAuth("Super Admin"),
    adminController.editPage
);

router.post(
    "/admin/update/:id",
    roleAuth("Super Admin"),
    adminController.update
);


router.get(
    "/admin/delete/:id",
    roleAuth("Super Admin"),
    adminController.delete
);

// Admin Logout

router.get(
    "/admin/logout",
    adminController.logout
);

router.get(
    "/admin",
    roleAuth("Super Admin"),
    adminController.index
);
module.exports = router;