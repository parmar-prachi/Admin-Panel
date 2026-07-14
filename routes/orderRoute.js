const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");


// View Orders

router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.viewPage
);

// Add Order

router.get(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.addPage
);

router.post(
    "/add",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.insertOrder
);


// Edit Order
router.get(
    "/edit/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.editPage
);

router.post(
    "/update/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.updateOrder
);

// Delete Order

router.get(
    "/delete/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.deleteOrder
);


// Toggle Order Status

router.get(
    "/status/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.toggleStatus
);
// View Order Details
router.get(
    "/view/:id",
    sessionAuth,
    roleAuth("Super Admin", "Admin"),
    orderController.viewSingleOrder
);

module.exports = router;