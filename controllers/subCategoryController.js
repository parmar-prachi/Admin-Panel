const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const fs = require("fs");
const path = require("path");

// Add Page

exports.addSubCategoryPage = async (req, res) => {
    try {

        const categories = await Category.find({
            status: "Active"
        }).sort({ name: 1 });

        res.render("subcategory/add", {
            categories
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load categories.");

        return res.redirect("/subcategory");

    }
};

// Insert

exports.insertSubCategory = async (req, res) => {
    try {

        const { category, name, description, status } = req.body;

        // Check if category exists
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {

            req.flash("error", "Invalid Category.");

            return res.redirect("/subcategory/add");

        }

        // Check duplicate subcategory in same category
        const subCategoryExists = await SubCategory.findOne({

            category: category,

            name: name.trim()

        });

        if (subCategoryExists) {

            req.flash("error", "Sub Category already exists.");

            return res.redirect("/subcategory/add");

        }

        // Image
        let image = "";

        if (req.file) {

            image = "subcategory/" + req.file.filename;

        }

        // Create Sub Category
        await SubCategory.create({

            category,

            name: name.trim(),

            description,

            status,

            image

        });

        req.flash("success", "Sub Category added successfully.");

        return res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add Sub Category.");

        return res.redirect("/subcategory/add");

    }
};

// View :

exports.viewSubCategoryPage = async (req, res) => {
    try {

        const search = req.query.search
            ? req.query.search.trim()
            : "";

        const status = req.query.status || "";

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        let query = {};

        // Search
        if (search) {

            query.name = {
                $regex: search,
                $options: "i"
            };

        }

        // Status Filter
        if (status) {

            query.status = status;

        }

        const total = await SubCategory.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        const subCategories = await SubCategory.find(query)

            .populate("category")

            .sort({ createdAt: -1 })

            .skip(skip)

            .limit(limit);

        res.render("subcategory/table", {

            subCategories,

            search,

            status,

            page,

            totalPages

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load Sub Categories.");

        return res.redirect("/dashboard");

    }
};

// Edit :

exports.editSubCategoryPage = async (req, res) => {
    try {

        // Find Sub Category
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {

            req.flash("error", "Sub Category not found.");

            return res.redirect("/subcategory");

        }

        // Load Active Categories
        const categories = await Category.find({
            status: "Active"
        }).sort({ name: 1 });

        res.render("subcategory/edit", {
            subCategory,
            categories
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/subcategory");

    }
};

// Update :

exports.updateSubCategory = async (req, res) => {
    try {

        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {

            req.flash("error", "Sub Category not found.");

            return res.redirect("/subcategory");

        }

        // Check Duplicate Name
        const exists = await SubCategory.findOne({
            name: req.body.name.trim(),
            _id: { $ne: req.params.id }
        });

        if (exists) {

            req.flash("error", "Sub Category already exists.");

            return res.redirect("/subcategory");

        }

        // Update Fields
        subCategory.name = req.body.name.trim();
        subCategory.category = req.body.category;
        subCategory.description = req.body.description;
        subCategory.status = req.body.status;

        // Update Image
        if (req.file) {

            // Delete Old Image
            if (subCategory.image) {

                const imagePath = path.join(
                    __dirname,
                    "../uploads",
                    subCategory.image
                );

                if (fs.existsSync(imagePath)) {

                    fs.unlinkSync(imagePath);

                }

            }

            subCategory.image = "subcategory/" + req.file.filename;

        }

        await subCategory.save();

        req.flash("success", "Sub Category updated successfully.");

        return res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update Sub Category.");

        return res.redirect("/subcategory");

    }
};

// Delete :

exports.deleteSubCategory = async (req, res) => {
    try {

        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {

            req.flash("error", "Sub Category not found.");

            return res.redirect("/subcategory");

        }

        await SubCategory.findByIdAndDelete(req.params.id);

        req.flash("success", "Sub Category deleted successfully.");

        return res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete Sub Category.");

        return res.redirect("/subcategory");

    }
};

// Status :

exports.toggleStatus = async (req, res) => {

    try {

        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {

            req.flash("error", "Sub Category not found.");

            return res.redirect("/subcategory");

        }

        subCategory.status =
            subCategory.status === "Active"
                ? "Inactive"
                : "Active";

        await subCategory.save();

        req.flash("success", "Status Updated.");

        res.redirect("/subcategory");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to update status.");

        res.redirect("/subcategory");

    }

};