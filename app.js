require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const session = require("express-session");
const passport = require("./config/passport");
const profileRoute = require("./routes/profileRoute");
const connectDB = require("./config/db");
const passwordRoute = require("./routes/passwordRoute");
const flash = require("connect-flash");
const dashboardRoute = require("./routes/dashboardRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoute");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const extraSubCategoryRoute = require("./routes/extraSubCategoryRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");


const app = express();

// Connect DB
connectDB();

// Middleware

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "full-admin-panel-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {

    res.locals.currentUser = req.user;

    next();

});
app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();

});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadDir = path.join(__dirname, "uploads/users");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Home Route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Routes
app.use("/", authRoute);
app.use("/", dashboardRoute);
app.use("/users", userRoute);
app.use("/", profileRoute);
app.use("/", passwordRoute);
app.use("/", adminRoute);
app.use("/category", categoryRoute);
app.use("/subcategory", subCategoryRoute);
app.use("/extrasubcategory", extraSubCategoryRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);

// 404

app.use((req, res) => {
    res.status(404).send("404 Page Not Found");
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});