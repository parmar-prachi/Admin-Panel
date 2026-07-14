const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ExtraSubCategory = require("../models/ExtraSubCategory");



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
            .populate("category")
            .populate("subCategory")
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


exports.addPage = async (req, res) => {

    try {

        const categories = await Category.find({
            status: "Active"
        });

        const subCategories = await SubCategory.find({
            status: "Active"
        });

        res.render("extrasubCategory/add", {

            categories,
            subCategories

        });

    } catch (err) {

        console.log(err);
        res.redirect("/extrasubcategory");

    }

};




// Insert


exports.insertExtraSubCategory = async (req, res) => {

    try {

        await ExtraSubCategory.create({

            category: req.body.category,

            subCategory: req.body.subCategory,

            name: req.body.name,

            description: req.body.description,

            status: req.body.status,

            image: req.file
                ? "extrasubCategory/" + req.file.filename
                : ""

        });

        req.flash("success", "Extra Sub Category Added Successfully.");

        res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add Extra Sub Category.");

        res.redirect("/extrasubcategory/add");

    }

};




// Edit Page


exports.editPage = async (req, res) => {

    try {

        const categories = await Category.find();

        const subCategories = await SubCategory.find();

        const extrasubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extrasubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        res.render("extrasubCategory/edit", {

            categories,
            subCategories,
            extrasubCategory

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("/extrasubcategory");

    }

};




// Update


exports.updateExtraSubCategory = async (req, res) => {

    try {

        const extrasubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extrasubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        extrasubCategory.category = req.body.category;

        extrasubCategory.subCategory = req.body.subCategory;

        extrasubCategory.name = req.body.name;

        extrasubCategory.description = req.body.description;

        extrasubCategory.status = req.body.status;

        if (req.file) {

            extrasubCategory.image = "extrasubCategory/" + req.file.filename;

        }

        await extrasubCategory.save();

        req.flash("success", "Extra Sub Category Updated Successfully.");

        res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update.");

        res.redirect("/extrasubcategory");

    }

};




// Delete


exports.deleteExtraSubCategory = async (req, res) => {

    try {

        await ExtraSubCategory.findByIdAndDelete(req.params.id);

        req.flash("success", "Extra Sub Category Deleted Successfully.");

        res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete.");

        res.redirect("/extrasubcategory");

    }

};




// Toggle Status


exports.toggleStatus = async (req, res) => {

    try {

        const extrasubCategory = await ExtraSubCategory.findById(req.params.id);

        if (!extrasubCategory) {

            req.flash("error", "Extra Sub Category not found.");

            return res.redirect("/extrasubcategory");

        }

        extrasubCategory.status =
            extrasubCategory.status === "Active"
                ? "Inactive"
                : "Active";

        await extrasubCategory.save();

        req.flash("success", "Status Updated Successfully.");

        res.redirect("/extrasubcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update status.");

        res.redirect("/extrasubcategory");

    }

};