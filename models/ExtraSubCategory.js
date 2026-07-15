const mongoose = require("mongoose");

const extraSubCategorySchema = new mongoose.Schema({

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: String,

    image: String,

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "ExtraSubCategory",
    extraSubCategorySchema
);