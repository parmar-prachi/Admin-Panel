const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

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

    name: {
        type: String,
        required: true,
        trim: true
    },

    brand: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true
    },

    salePrice: {
        type: Number,
        default: 0
    },

    quantity: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);