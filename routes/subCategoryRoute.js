const express = require("express");
const router = express.Router();
const upload = require("../config/subCategoryMulter");

const subCategoryController = require("../controllers/subCategoryController");
const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin","Admin"),
    subCategoryController.viewPage
);

router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin","Admin"),
    subCategoryController.addPage
);
router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    subCategoryController.insertSubCategory
);
// Edit Page
router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    subCategoryController.editPage
);

// Update
router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    subCategoryController.updateSubCategory
);

// Delete
router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    subCategoryController.deleteSubCategory
);
router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    subCategoryController.toggleStatus
);
module.exports = router;