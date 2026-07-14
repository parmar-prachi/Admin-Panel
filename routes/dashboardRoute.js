const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const sessionAuth = require("../middleware/sessionAuth");

router.get("/dashboard", sessionAuth, dashboardController.dashboard);

module.exports = router;