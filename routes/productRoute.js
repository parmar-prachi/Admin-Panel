const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

const upload = require("../config/productMulter");


// View Products

router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.viewPage
);


// Add Product Page

router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.addPage
);


// Insert Product

router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "gallery",
            maxCount: 5
        }
    ]),
    productController.insertProduct
);



// Edit Product Page

router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.editPage
);


// Update Product
router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),

    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "gallery",
            maxCount: 5
        }
    ]),

    productController.updateProduct
);


// Delete Product

router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.deleteProduct
);



// Toggle Product Status

router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.toggleStatus
);


// View Single Product

router.get(
    "/view/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.viewSingleProduct
);


// Get Sub Categories

router.get(
    "/get-subcategories/:categoryId",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.getSubCategories
);


// Get Extra Sub Categories

router.get(
    "/get-extrasubcategories/:subCategoryId",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    productController.getExtraSubCategories
);



module.exports = router;