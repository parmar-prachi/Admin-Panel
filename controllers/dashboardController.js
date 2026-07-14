const User = require("../models/User");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ExtraSubCategory = require("../models/ExtraSubCategory");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.dashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalCategories = await Category.countDocuments();

        const totalSubCategories = await SubCategory.countDocuments();

        const totalExtraSubCategories = await ExtraSubCategory.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenue = await Order.aggregate([

            {
                $match: {
                    paymentStatus: "Paid"
                }
            },

            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$grandTotal"
                    }
                }
            }

        ]);

        const totalRevenue =
            revenue.length > 0
                ? revenue[0].totalRevenue
                : 0;
        const monthlySales = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }
                    },
                    total: {
                        $sum: "$grandTotal"
                    }
                }
            },
            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);

        const salesData = new Array(12).fill(0);

        monthlySales.forEach(item => {
            salesData[item._id.month - 1] = item.total;
        });

        const recentOrders = await Order.find()
            .populate("product")
            .sort({ createdAt: -1 })
            .limit(5);

        const lowStockProducts = await Product.find({
            quantity: { $lte: 5 }
        })
            .populate("category")
            .sort({ quantity: 1 })
            .limit(5);
        const topSellingProducts = await Order.aggregate([

            {
                $group: {
                    _id: "$product",
                    totalSold: {
                        $sum: "$quantity"
                    }
                }
            },

            {
                $sort: {
                    totalSold: -1
                }
            },

            {
                $limit: 5
            },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },

            {
                $unwind: "$product"
            }

        ]);

        res.render("dashboard", {

            user: req.user,

            totalUsers,
            totalCategories,
            totalSubCategories,
            totalExtraSubCategories,
            totalProducts,
            totalOrders,
            totalRevenue,

            salesData,

            recentOrders,

            lowStockProducts,

            topSellingProducts
        })

    }

    catch (err) {

        console.log(err);

        res.redirect("/login");

    }

};