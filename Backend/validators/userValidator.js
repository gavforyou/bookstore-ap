// Import the express validator tools
// body - refers to the req.body when the data input from client comes from.
// validationResult - gathers all the result of the validation steps.
const { body, validationResult } = require("express-validator");

exports.validateRegister = [

    // These are the validations to check the data input for the firstName, lastName, email, mobileNo and password fields.
    body("firstName").notEmpty().withMessage("First name is Required"),
    body("lastName").notEmpty().withMessage("Last Name is Required"),
    // isEmail() checks the whole format of the email input if it its correct.
    body("email").isEmail().withMessage("Email is Required"),
    body("mobileNo").isLength({min: 11, max: 11}).withMessage("Mobile Number must be exactly 11 characters"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters"),

    (req, res, next) => {
        // Collects all validation errors from the previous rules.
        const errors = validationResult(req);

        // If any error encountered send it back to the client.
        if(!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg,
                errors: errors.array()
            })
        }

        // If no error, proceed to the next controller function.
        next();

    }
];

// Validation middleware for login route.
exports.validateLogin = [
    body("email").isEmail().withMessage("Email is Required"),
    body("password").isLength({min: 8}).withMessage("Password is Required"),

    (req, res, next) => {
        // Collects all validation errors from the previous rules.
        const errors = validationResult(req);

        // If any error encountered send it back to the client.
        if(!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg,
                errors: errors.array()
            })
        }

        // If no error, proceed to the next controller function.
        next();

    }
];
