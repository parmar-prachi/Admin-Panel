const express = require("express");
const router = express.Router();

const extraSubCategoryController = require("../controllers/extraSubCategoryController");
const upload = require("../config/extraSubCategoryMulter");

const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

// View
router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    extraSubCategoryController.viewPage
);

// Add Page
router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    extraSubCategoryController.addPage
);

// Insert
router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    extraSubCategoryController.insertExtraSubCategory
);

// Edit Page
router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    extraSubCategoryController.editPage
);

// Update
router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    extraSubCategoryController.updateExtraSubCategory
);

// Delete
router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    extraSubCategoryController.deleteExtraSubCategory
);

// Status
router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    extraSubCategoryController.toggleStatus
);

module.exports = router;