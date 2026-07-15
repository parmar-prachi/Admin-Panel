const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");
const upload = require("../config/categoryMulter");

router.get("/", sessionAuth, roleAuth("Super Admin", "Admin"), categoryController.viewCategoryPage);

router.get("/add", sessionAuth, roleAuth("Super Admin", "Admin"), categoryController.addCategoryPage);

router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    categoryController.insertCategory
);

router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    categoryController.editCategoryPage
);

router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    categoryController.updateCategory
);

router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin"),
    categoryController.deleteCategory
);

router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    categoryController.toggleStatus
);
module.exports = router;