/* ORDER MODEL */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is Required']
    },
    books: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book ID is Required']
        },
        title: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is Required'],
            min: 1
        },
        price: {
            type: Number,
            required: [true, 'Book Price is Required']
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, 'Total Price is Required']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        type: String,
        required: [true, 'Shipping Address is Required']
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'online_banking', 'cash_on_delivery'],
        required: [true, 'Payment Method is Required']
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Order', orderSchema);
