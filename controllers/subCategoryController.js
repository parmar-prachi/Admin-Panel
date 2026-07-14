const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// View :

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

        const total = await SubCategory.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        const subCategories = await SubCategory.find(query)
            .populate("category")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render("subCategory/table", {

            subCategories,

            search,

            status,

            page,

            totalPages

        });

    }

    catch (err) {

        console.log(err);

        res.redirect("/dashboard");

    }

};

// Add Page
exports.addPage = async (req, res) => {

    const categories = await Category.find({
        status: "Active"
    });

    res.render("subCategory/add", {
        categories
    });

};

// Insert
exports.insertSubCategory = async (req, res) => {

    try {

        await SubCategory.create({

            category: req.body.category,

            name: req.body.name,

            description: req.body.description,

            status: req.body.status,

            image: req.file
                ? "subCategory/" + req.file.filename
                : ""

        });

        req.flash("success", "Sub Category Added Successfully.");

        res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add Sub Category.");

        res.redirect("/subcategory/add");

    }
};

// Edit :

exports.editPage = async (req, res) => {

    try {

        const categories = await Category.find();

        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {

            req.flash("error", "Sub Category not found.");

            return res.redirect("/subcategory");

        }

        res.render("subCategory/edit", {

            categories,

            subCategory

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("/subcategory");

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

        subCategory.category = req.body.category;
        subCategory.name = req.body.name;
        subCategory.description = req.body.description;
        subCategory.status = req.body.status;

        if (req.file) {

            subCategory.image = "subCategory/" + req.file.filename;

        }

        await subCategory.save();

        req.flash("success", "Sub Category Updated.");

        res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update.");

        res.redirect("/subcategory");

    }

};

// Delete :

exports.deleteSubCategory = async (req, res) => {

    try {

        await SubCategory.findByIdAndDelete(req.params.id);

        req.flash("success", "Sub Category Deleted.");

        res.redirect("/subcategory");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete.");

        res.redirect("/subcategory");

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