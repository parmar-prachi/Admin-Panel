const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    customerEmail: {
        type: String,
        required: true,
        trim: true
    },

    customerMobile: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },

    price: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        required: true
    },

    gst: {
        type: Number,
        default: 0
    },

    shippingCharge: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    grandTotal: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Card",
            "Net Banking"
        ],
        default: "Cash"
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed"
        ],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Processing",
            "Packed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);