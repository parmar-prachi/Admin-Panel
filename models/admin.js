const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },


    lastName: {
        type: String,
        required: true
    },


    email: {
        type: String,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true
    },


    mobile: {
        type: String
    },


    role: {
        type: String,
        enum: [
            "Super Admin",
            "Manager",
            "Staff"
        ],
        default: "Staff"
    },


    status: {
        type: String,
        enum: [
            "Active",
            "Inactive"
        ],
        default: "Active"
    },


    image: {
        type: String
    }


},
    {
        timestamps: true
    });


module.exports = mongoose.model("Admin", adminSchema);