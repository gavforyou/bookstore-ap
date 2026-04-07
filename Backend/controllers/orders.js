/* ORDERS CONTROLLER */
const Order = require("../models/Order");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

//[SECTION] Create an order
module.exports.createOrder = (req, res) => {

    // Calculate subtotal for each book
    let totalPrice = 0;
    const books = req.body.books.map(book => {
        const subtotal = book.quantity * book.price;
        totalPrice += subtotal;
        return {
            bookId: book.bookId,
            title: book.title,
            quantity: book.quantity,
            price: book.price,
            subtotal: subtotal
        };
    });

    let newOrder = new Order({
        userId: req.user.id,
        books: books,
        totalPrice: totalPrice,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod
    });

    return newOrder.save().then(result => {
        // Update book quantity
        result.books.forEach(item => {
            Book.findByIdAndUpdate(
                item.bookId,
                {$inc: {quantity: -item.quantity}},
                {new: true}
            ).catch(error => console.error("Error updating book quantity:", error));
        });

        // Clear the user's cart
        Cart.findOneAndUpdate(
            { userId: req.user.id },
            { items: [] }
        ).catch(error => console.error("Error clearing cart:", error));

        return res.status(201).send({
            success: true,
            message: "Order created successfully",
            result: result
        });
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all orders (Admin only)
module.exports.getAllOrders = (req, res) => {

    return Order.find({})
    .populate('userId', 'firstName lastName email')
    .populate('books.bookId', 'title author isbn')
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No orders found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve orders for a specific user
module.exports.getUserOrders = (req, res) => {

    return Order.find({userId: req.user.id})
    .populate('userId', 'firstName lastName email')
    .populate('books.bookId', 'title author isbn')
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "No orders found for this user"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve a specific order
module.exports.getOrder = (req, res) => {

    return Order.findById(req.params.orderId)
    .populate('userId', 'firstName lastName email')
    .populate('books.bookId', 'title author isbn')
    .then(result => {
        if(result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({message: "Order not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Update order status (Admin only)
module.exports.updateOrderStatus = (req, res) => {

    const validStatus = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if(!validStatus.includes(req.body.status)) {
        return res.status(400).send({message: "Invalid order status"});
    }

    const updateData = {
        status: req.body.status
    };

    if(req.body.status === 'delivered' && !updateData.deliveryDate) {
        updateData.deliveryDate = Date.now();
    }

    return Order.findByIdAndUpdate(req.params.orderId, updateData, {new: true})
    .populate('userId', 'firstName lastName email')
    .populate('books.bookId', 'title author isbn')
    .then(result => {
        if(result) {
            return res.status(200).send({
                success: true,
                message: "Order status updated successfully",
                result: result
            });
        } else {
            return res.status(404).send({message: "Order not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Cancel an order
module.exports.cancelOrder = (req, res) => {

    return Order.findById(req.params.orderId)
    .then(order => {
        if(!order) {
            return res.status(404).send({message: "Order not found"});
        }

        // Only allow cancellation if order is pending
        if(order.status !== 'pending') {
            return res.status(400).send({message: "Only pending orders can be cancelled"});
        }

        // Restore book quantities
        order.books.forEach(item => {
            Book.findByIdAndUpdate(
                item.bookId,
                {$inc: {quantity: item.quantity}},
                {new: true}
            ).catch(error => console.error("Error restoring book quantity:", error));
        });

        return Order.findByIdAndUpdate(req.params.orderId, {status: 'cancelled'}, {new: true})
        .populate('userId', 'firstName lastName email')
        .populate('books.bookId', 'title author isbn')
        .then(result => {
            return res.status(200).send({
                success: true,
                message: "Order cancelled successfully",
                result: result
            });
        });
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Get order statistics (Admin only)
module.exports.getOrderStats = (req, res) => {

    return Order.aggregate([
        {
            $facet: {
                totalOrders: [{$count: "count"}],
                totalRevenue: [{$group: {_id: null, total: {$sum: "$totalPrice"}}}],
                ordersByStatus: [{$group: {_id: "$status", count: {$sum: 1}}}]
            }
        }
    ])
    .then(result => {
        return res.status(200).send(result[0]);
    })
    .catch(error => errorHandler(error, req, res));
};
