const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },

    lastName: { type: String },
    mobile: { type: String },
    gender: { type: String },
    dob: { type: Date },
    age: { type: Number },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    education: { type: String },
    occupation: { type: String },
    hobbies: { type: [String] },

    joiningDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    image: {
        type: String,
        default: "default.png"
    },
    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: [
            "Super Admin",
            "Admin",
            "Manager",
            "Employee"
        ],
        default: "Employee"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);