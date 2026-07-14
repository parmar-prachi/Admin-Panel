const Order = require("../models/Order");
const Product = require("../models/Product");


// View Orders
exports.viewPage = async (req, res) => {

    try {

        let search = req.query.search || "";
        let status = req.query.status || "";

        let page = parseInt(req.query.page) || 1;
        let limit = 10;


        let query = {};


        // Search Order Number
        if (search) {

            query.orderNumber = {
                $regex: search,
                $options: "i"
            };

        }


        // Status Filter
        if (status) {

            query.status = status;

        }



        // Total Orders
        const totalOrders = await Order.countDocuments(query);


        // Total Pages
        const totalPages = Math.ceil(totalOrders / limit);



        // Orders with Pagination
        const orders = await Order.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });



        res.render("order/table", {

            orders,
            search,
            status,

            currentPage: page,
            totalPages

        });


    } catch (err) {

        console.log(err);

    }

};


// Add Order Page


exports.addPage = async (req, res) => {

    try {

        const products = await Product.find({
            status: "Active"
        });

        res.render("order/add", {

            products

        });

    } catch (err) {

        console.log(err);

        res.redirect("/order");

    }

};


// Insert Order


exports.insertOrder = async (req, res) => {

    try {

        await Order.create({

            orderNumber: req.body.orderNumber,

            customerName: req.body.customerName,

            customerEmail: req.body.customerEmail,

            customerMobile: req.body.customerMobile,

            address: req.body.address,

            product: req.body.product,

            quantity: req.body.quantity,

            price: req.body.price,

            subtotal: req.body.subtotal,

            gst: req.body.gst,

            shippingCharge: req.body.shippingCharge,

            discount: req.body.discount,

            grandTotal: req.body.grandTotal,

            paymentMethod: req.body.paymentMethod,

            paymentStatus: req.body.paymentStatus,

            orderStatus: req.body.orderStatus

        });

        req.flash("success", "Order Added Successfully.");

        res.redirect("/order");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add order.");

        res.redirect("/order/add");

    }

};
// View single :

exports.viewSingleOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("product");

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/order");

        }

        res.render("order/view", {
            order
        });

    } catch (err) {

        console.log(err);

        res.redirect("/order");

    }

};

// Edit :

exports.editPage = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("product");

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/order");

        }

        res.render("order/edit", {
            order
        });

    } catch (err) {

        console.log(err);

        res.redirect("/order");

    }

};

// Update :

exports.updateOrder = async (req, res) => {

    try {

        await Order.findByIdAndUpdate(

            req.params.id,

            {

                orderStatus: req.body.orderStatus,

                paymentStatus: req.body.paymentStatus

            }

        );

        req.flash("success", "Order Updated Successfully.");

        res.redirect("/order");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to update order.");

        res.redirect("/order");

    }

};

// Delete :

exports.deleteOrder = async (req, res) => {

    try {

        await Order.findByIdAndDelete(req.params.id);

        req.flash("success", "Order Deleted Successfully.");

        res.redirect("/order");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete order.");

        res.redirect("/order");

    }

};

// Status :

exports.toggleStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/order");

        }

        order.orderStatus =
            order.orderStatus === "Delivered"
                ? "Pending"
                : "Delivered";

        await order.save();

        req.flash("success", "Order Status Updated.");

        res.redirect("/order");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update status.");

        res.redirect("/order");

    }

};