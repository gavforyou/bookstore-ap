/* ORDER VALIDATOR */
const { body, validationResult } = require("express-validator");

// Validator for creating an order
exports.createOrderValidator = [

    body("books")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one book"),

    body("books.*.bookId")
        .notEmpty()
        .withMessage("Book ID is required"),

    body("books.*.title")
        .isLength({ min: 2 })
        .withMessage("Book title must be at least 2 characters"),

    body("books.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("books.*.price")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value > 0)
        .withMessage("Price must be greater than 0"),

    body("shippingAddress")
        .isLength({ min: 10 })
        .withMessage("Shipping address must be at least 10 characters"),

    body("paymentMethod")
        .isIn(['credit_card', 'debit_card', 'online_banking', 'cash_on_delivery'])
        .withMessage("Invalid payment method"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: errors.array()[0].msg,
                errors: errors.array()
            });
        }

        next();
    }
];

// Validator for updating order status
exports.updateOrderStatusValidator = [

    body("status")
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage("Invalid order status"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: errors.array()[0].msg,
                errors: errors.array()
            });
        }

        next();
    }
];
