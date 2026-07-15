const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ExtraSubCategory = require("../models/ExtraSubCategory");
const fs = require("fs");
const path = require("path");

// View Page

exports.viewPage = async (req, res) => {

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

        const total = await ExtraSubCategory.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        const extraSubCategories = await ExtraSubCategory.find(query)
            .populate({
                path: "subCategory",
                populate: {
                    path: "category"
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
     
        res.render("extrasubCategory/table", {
            extraSubCategories,
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


// Add Page

exports.addExtraSubCategoryPage = async (req, res) => {

    try {


        const categories = await Category.find({
            status: "Active"
        })
            .sort({ name: 1 });



        const subCategories = await SubCategory.find({
            status: "Active"
        })
            .populate("category")
            .sort({ name: 1 });



        res.render("extrasubcategory/add", {

            categories,
            subCategories

        });


    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory");

    }

};

// Insert

exports.insertExtraSubCategory = async (req, res) => {

    try {

        const name = (req.body.name || "").trim();

        // Check Duplicate
        const exists = await ExtraSubCategory.findOne({
            name,
            subCategory: req.body.subCategory
        });

        if (exists) {

            req.flash("error", "Extra Sub Category already exists.");

            return res.redirect("/extrasubcategory/add");

        }

        // Image
        let image = "";

        if (req.file) {

            image = "extrasubcategory/" + req.file.filename;

        }

        // Create
        await ExtraSubCategory.create({

            subCategory: req.body.subCategory,

            name,

            description: req.body.description,

            status: req.body.status || "Active",

            image

        });

        req.flash("success", "Extra Sub Category added successfully.");

        return res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory/add");

    }

};

// Edit Page
exports.editExtraSubCategoryPage = async (req, res) => {

    try {

        const extraSubCategory = await ExtraSubCategory.findById(req.params.id)
            .populate({
                path: "subCategory",
                populate: {
                    path: "category"
                }
            });

        if (!extraSubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        // Load Categories
        const categories = await Category.find({
            status: "Active"
        }).sort({ name: 1 });

        // Load Sub Categories
        const subCategories = await SubCategory.find({
            status: "Active"
        })
            .populate("category")
            .sort({ name: 1 });

        res.render("extrasubcategory/edit", {
            extraSubCategory,
            categories,
            subCategories
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory");

    }

};

// Update

exports.updateExtraSubCategory = async (req, res) => {

    try {

        const extraSubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extraSubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        const name = (req.body.name || "").trim();

        // Check duplicate (excluding current record)
        const exists = await ExtraSubCategory.findOne({
            _id: { $ne: req.params.id },
            name,
            subCategory: req.body.subCategory
        });

        if (exists) {

            req.flash("error", "Extra Sub Category already exists.");

            return res.redirect("/extrasubcategory");

        }

        // Update fields
        extraSubCategory.subCategory = req.body.subCategory;
        extraSubCategory.name = name;
        extraSubCategory.description = req.body.description;
        extraSubCategory.status = req.body.status;

        // Update image
        if (req.file) {

            // Delete old image
            if (extraSubCategory.image) {

                const oldImage = path.join(
                    __dirname,
                    "../uploads",
                    extraSubCategory.image
                );

                if (fs.existsSync(oldImage)) {

                    fs.unlinkSync(oldImage);

                }

            }

            extraSubCategory.image =
                "extrasubcategory/" + req.file.filename;

        }

        await extraSubCategory.save();

        req.flash("success", "Extra Sub Category updated successfully.");

        return res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory");

    }

};

// Delete

exports.deleteExtraSubCategory = async (req, res) => {

    try {

        const extraSubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extraSubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        // Delete Image
        if (extraSubCategory.image) {

            const imagePath = path.join(
                __dirname,
                "../uploads",
                extraSubCategory.image
            );

            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);

            }

        }

        await ExtraSubCategory.findByIdAndDelete(req.params.id);

        req.flash(
            "success",
            "Extra Sub Category deleted successfully."
        );

        return res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory");

    }

};

// Toggle Status

exports.toggleStatus = async (req, res) => {

    try {

        const extraSubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extraSubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        extraSubCategory.status =
            extraSubCategory.status === "Active"
                ? "Inactive"
                : "Active";

        await extraSubCategory.save();

        req.flash(
            "success",
            "Extra Sub Category status updated successfully."
        );

        return res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/extrasubcategory");

    }

};

exports.getExtraSubCategories = async (req, res) => {

    try {

        const extraSubCategories = await ExtraSubCategory.find({
            subCategory: req.params.subCategoryId,
            status: "Active"
        });


        res.json(extraSubCategories);


    } catch (err) {

        console.log(err);

        res.json([]);

    }

};