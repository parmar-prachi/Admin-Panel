const Category = require("../models/Category");
const permission = require("../middleware/categoryPermission");
const fs = require("fs");
const path = require("path");

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
    try {

        // Permission Check
        if (!permission.canCreateCategory(req.user.role)) {

            req.flash("error", "Access Denied.");

            return res.redirect("/category");

        }

        // Clean Input
        const name = (req.body.name || "").trim();

        if (!name) {

            req.flash("error", "Category name is required.");

            return res.redirect("/category/add");

        }

        // Check Duplicate
        const exists = await Category.findOne({ name });

        if (exists) {

            req.flash("error", "Category already exists.");

            return res.redirect("/category/add");

        }

        // Create Category
        await Category.create({

            name,

            description: req.body.description,

            status: req.body.status || "Active",

            image: req.file
                ? "category/" + req.file.filename
                : ""

        });

        req.flash("success", "Category Added Successfully.");

        return res.redirect("/category");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add category.");

        return res.redirect("/category/add");

    }
};

// Edit :

exports.editCategoryPage = async (req, res) => {

    try {

        const { id } = req.params;

        // Check ID
        if (!id) {

            req.flash("error", "Invalid Category ID.");

            return res.redirect("/category");

        }

        // Find Category
        const category = await Category.findById(id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        // Render Edit Page
        res.render("category/edit", {
            category
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/category");

    }

};

// Update :

exports.updateCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {

            req.flash("error", "Category not found.");

            return res.redirect("/category");

        }

        const name = (req.body.name || "").trim();

        // Duplicate Name Check
        const exists = await Category.findOne({
            name,
            _id: { $ne: id }
        });

        if (exists) {

            req.flash("error", "Category already exists.");

            return res.redirect("/category");

        }

        // Update Fields
        category.name = name;
        category.description = req.body.description;
        category.status = req.body.status;

        // Update Image
        if (req.file) {

            // Delete Old Image
            if (category.image) {

                const oldImage = path.join(
                    __dirname,
                    "../uploads",
                    category.image
                );

                if (fs.existsSync(oldImage)) {

                    fs.unlinkSync(oldImage);

                }

            }

            category.image = "category/" + req.file.filename;

        }

        await category.save();

        req.flash("success", "Category updated successfully.");

        return res.redirect("/category");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update category.");

        return res.redirect("/category");

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

        // Delete Image
        if (category.image) {

            const imagePath = path.join(
                __dirname,
                "../uploads",
                category.image
            );

            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);

            }

        }

        await Category.findByIdAndDelete(req.params.id);

        req.flash("success", "Category deleted successfully.");

        return res.redirect("/category");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete category.");

        return res.redirect("/category");

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