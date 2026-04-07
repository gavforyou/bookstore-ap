/* ORDERS ROUTES */
const express = require("express");
const ordersController = require("../controllers/orders");

// Validators
const {
    createOrderValidator,
    updateOrderStatusValidator
} = require("../validators/orderValidator");

const { verify, verifyAdmin } = require("../auth");

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating an order
router.post("/", verify, createOrderValidator, ordersController.createOrder);

//[SECTION] Route for retrieving all orders (Admin only)
router.get("/all", verify, verifyAdmin, ordersController.getAllOrders);

//[SECTION] Route for retrieving user's orders
router.get("/user/my-orders", verify, ordersController.getUserOrders);

//[SECTION] Route for retrieving a specific order
router.get("/:orderId", verify, ordersController.getOrder);

//[SECTION] Route for updating order status (Admin only)
router.patch("/:orderId/status", verify, verifyAdmin, updateOrderStatusValidator, ordersController.updateOrderStatus);

//[SECTION] Route for cancelling an order
router.patch("/:orderId/cancel", verify, ordersController.cancelOrder);

//[SECTION] Route for getting order statistics (Admin only)
router.get("/stats/overview", verify, verifyAdmin, ordersController.getOrderStats);

//[SECTION] Export Route System
module.exports = router;
