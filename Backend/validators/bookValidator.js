/* BOOK VALIDATOR */
const { body, validationResult } = require("express-validator");
const Book = require("../models/Book");

// Validator for adding a book
exports.addBookValidator = [

    body("title")
        .isLength({ min: 5 })
        .withMessage("Title must be longer than 5 characters"),

    body("author")
        .isLength({ min: 3 })
        .withMessage("Author name must be longer than 3 characters"),

    body("isbn")
        .isLength({ min: 10 })
        .withMessage("ISBN must be at least 10 characters"),

    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value > 0)
        .withMessage("Price must be greater than 0"),

    body("quantity")
        .isInt({min: 0})
        .withMessage("Quantity must be a non-negative integer"),

    body("category")
        .isLength({ min: 3 })
        .withMessage("Category must be longer than 3 characters"),

    body("description")
        .isLength({ min: 10 })
        .withMessage("Description must be longer than 10 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

// Validator for updating a book
exports.updateBookValidator = [

    body("title")
        .optional()
        .isLength({ min: 5 })
        .withMessage("Title must be longer than 5 characters"),

    body("author")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Author name must be longer than 3 characters"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value > 0)
        .withMessage("Price must be greater than 0"),

    body("quantity")
        .optional()
        .isInt({min: 0})
        .withMessage("Quantity must be a non-negative integer"),

    body("description")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Description must be longer than 10 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

// Validator for searching a book
exports.searchBookValidator = [

    body("title")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Search term must be at least 2 characters"),

    body("author")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Search term must be at least 2 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];
