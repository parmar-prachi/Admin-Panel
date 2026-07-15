const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // Relations
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    extraSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraSubCategory",
        required: true
    },

    // Basic Details
    name: {
        type: String,
        required: true,
        trim: true
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    brand: {
        type: String,
        trim: true
    },

    description: {
        type: String
    },

    // Pricing
    price: {
        type: Number,
        required: true,
        min: 0
    },

    discount: {
        type: Number,
        default: 0,
        min: 0
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    // Images
    thumbnail: {
        type: String,
        default: ""
    },

    gallery: [{
        type: String
    }],
    salePrice: {
        type: Number,
        default: 0
    },
    // Status
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);