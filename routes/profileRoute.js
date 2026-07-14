const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const auth = require("../middleware/sessionAuth");
const upload = require("../config/multer");

router.get("/profile", auth, profileController.profile);
router.get("/profile/edit", auth, profileController.editProfilePage);

router.post(
    "/profile/update",
    upload.single("image"),
    profileController.updateProfile
);

router.get(
    "/profile/change-password",
    auth,
    profileController.changePasswordPage
);

router.post(
    "/profile/change-password",
    auth,
    profileController.changePassword
);

module.exports = router;