const Category = require("../models/Category");

exports.addCategoryPage = (req, res) => {

    res.render("category/add");

};
// View :

exports.viewCategoryPage = async (req, res) => {

    try {

        const search = req.query.search ? req.query.search.trim() : "";
        const status = req.query.status || "";

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (status) {
            query.status = status;
        }

        const total = await Category.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        const categories = await Category.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render("category/table", {
            categories,
            search,
            status,
            page,
            totalPages
        });

    } catch (err) {

        console.log(err);
        res.redirect("/dashboard");

    }

};

// Add :

exports.insertCategory = async (req, res) => {
    console.log("Insert Category Called");
    try {

        const exists = await Category.findOne({

            name: req.body.name.trim()

        });

        if (exists) {

            req.flash("error", "Category already exists.");

            return res.redirect("/category/add");

        }

        await Category.create({

            name: req.body.name,

            description: req.body.description,

            status: req.body.status,

            image: req.file
                ? "category/" + req.file.filename
                : ""

        });

        req.flash("success", "Category Added Successfully.");

        res.redirect("/category");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to add category.");

        res.redirect("/category/add");

    }

};
// Edit :
exports.editCategoryPage = async (req, res) => {
    console.log("EDIT PAGE OPENED");
    console.log(req.params.id);
    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        res.render("category/edit", { category });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("/category");

    }

};
// Update :

exports.updateCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        category.name = req.body.name;
        category.description = req.body.description;
        category.status = req.body.status;

        if (req.file) {

            category.image = "category/" + req.file.filename;

        }

        await category.save();

        req.flash("success", "Category updated successfully.");

        res.redirect("/category");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update category.");

        res.redirect("/category");

    }

};
// Delete :
exports.deleteCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        await Category.findByIdAndDelete(req.params.id);

        req.flash("success", "Category deleted successfully.");

        res.redirect("/category");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete category.");

        res.redirect("/category");

    }

};
// Status :

exports.toggleStatus = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        category.status =
            category.status === "Active"
                ? "Inactive"
                : "Active";

        await category.save();

        req.flash("success", "Category status updated.");

        res.redirect("/category");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to update status.");

        res.redirect("/category");

    }

};