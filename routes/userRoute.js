const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

const userController = require("../controllers/userController");

// Routes

router.get(
    "/",
    sessionAuth,
    roleAuth("Super Admin"),
    userController.viewUsers
);

router.get("/add", userController.addUser);

router.post(

    "/add",

    upload.single("image"),

    userController.insertUser

);
// Edit User Page
router.get("/edit/:id", userController.editUser);

// Update User
router.post(
    "/update/:id",
    upload.single("image"),
    userController.updateUser
);

router.get("/:id", userController.getSingleUser)

router.get("/delete/:id", userController.deleteUser);


module.exports = router;
