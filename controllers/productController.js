const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ExtraSubCategory = require("../models/ExtraSubCategory");
const Product = require("../models/Product");

// view :

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

        const total = await Product.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        const products = await Product.find(query)
            .populate("category")
            .populate("subCategory")
            .populate("extraSubCategory")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render("product/table", {

            products,
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

exports.addPage = async (req, res) => {

    try {

        const categories = await Category.find({
            status: "Active"
        });

        res.render("product/add", {
            categories
        });

    } catch (err) {

        console.log(err);

        res.redirect("/product");

    }

};

// Insert Product :

exports.insertProduct = async (req, res) => {
    

    try {

        const product = await Product.create({
            category: req.body.category,
            subCategory: req.body.subCategory,
            extraSubCategory: req.body.extraSubCategory,

            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            salePrice: req.body.salePrice,
            quantity: req.body.quantity,
            description: req.body.description,
            status: req.body.status,

            image: req.file
                ? "product/" + req.file.filename
                : ""
        });


        req.flash("success", "Product Added Successfully.");

        res.redirect("/product");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add product.");

        res.redirect("/product/add");

    }

};
exports.editPage = async (req, res) => {

    try {

        const categories = await Category.find({
            status: "Active"
        });

        const subCategories = await SubCategory.find({
            status: "Active"
        });

        const extraSubCategories = await ExtraSubCategory.find({
            status: "Active"
        });

        const product = await Product.findById(req.params.id);

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/product");

        }

        res.render("product/edit", {

            categories,
            subCategories,
            extraSubCategories,
            product

        });

    } catch (err) {

        console.log(err);

        res.redirect("/product");

    }

};
// Update :

exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/product");

        }

        product.category = req.body.category;
        product.subCategory = req.body.subCategory;
        product.extraSubCategory = req.body.extraSubCategory;

        product.name = req.body.name;
        product.brand = req.body.brand;
        product.price = req.body.price;
        product.salePrice = req.body.salePrice;
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.status = req.body.status;

        if (req.file) {
            product.image = "product/" + req.file.filename;
        }

        await product.save();

        req.flash("success", "Product Updated Successfully.");

        res.redirect("/product");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update product.");

        res.redirect("/product");

    }

};

// Delete Product

exports.deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        req.flash("success", "Product Deleted Successfully.");

        res.redirect("/product");

    } catch (err) {

        console.log(err);

        res.redirect("/product");

    }

};

// Toggle Status

exports.toggleStatus = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/product");

        }

        product.status =
            product.status === "Active"
                ? "Inactive"
                : "Active";

        await product.save();

        req.flash("success", "Product Status Updated.");

        res.redirect("/product");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update status.");

        res.redirect("/product");

    }

};
// Get Sub Categories
exports.getSubCategories = async (req, res) => {

    try {

        const subCategories = await SubCategory.find({
            category: req.params.categoryId,
            status: "Active"
        });

        res.json(subCategories);

    } catch (err) {

        console.log(err);
        res.json([]);

    }

};

// Get Extra Sub Categories
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
