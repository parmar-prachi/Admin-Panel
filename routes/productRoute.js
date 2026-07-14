const express = require("express");
const router = express.Router();
const upload = require("../config/productMulter");
const productController = require("../controllers/productController");
const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");


router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.viewPage
);

router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.addPage
);
router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.single("image"),
    productController.insertProduct
);
router.get("/get-subcategory/:categoryId", productController.getSubCategories);

router.get("/get-extrasubcategory/:subCategoryId", productController.getExtraSubCategories);

// Edit Product Page
router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.editPage
);

// Update Product

router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.deleteProduct
);

// Delete Product
router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.deleteProduct
);
// Toggle Status
router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.toggleStatus
);

module.exports = router;