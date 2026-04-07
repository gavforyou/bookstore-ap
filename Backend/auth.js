// Import our jsonwebtoken package
const jwt = require("jsonwebtoken");
// Import express-rate-limit to have access to the setup of rate limiter for the login route.
const rateLimit = require("express-rate-limit");


// Import our .env for environment variables.
require('dotenv').config();



// Function for creation of JWT
module.exports.createAccessToken = (user) => {

    // variable that contains the "Claims" in our JWT payload
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };


    // the sign() method initialize the creation of our token using the data and the secret key.
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {})

};

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {

    // console.log(req.headers.authorization);

    // req.headers.authorization contains sensitive data such as our token
    let token = req.headers.authorization;

    // If token is undefined, return an auth error message
    if(typeof token === "undefined") {
        return res.status(401).send({ auth: "Authentication Failed. No Token."})
    } else {
        // console.log(token);

        // use slice() method to remove the "Bearer " from the token then reassign back to the token variable.
        token = token.slice(7, token.length);

        // console.log(token);

        // [SECTION] Token Decryption
        // the verify() method of jwt opens the token to get its data and user the secret key to open it.
        // The token is decoded in the callback function and it will return either an error or the decodedToken.
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {

            // If err, return failed response.
            if(err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                // console.log("Result from the verify method:");
                // console.log(decodedToken);

                // Else if our token is verified to be correct, we will update the request and add the user's decoded details.
                req.user = decodedToken;

                // next() allows us to move to the next middleware. It also passes the details of the request and response to the next function or middleware.
                next();

            }
        })
    }
};

// [SECTION] Verify Admin
module.exports.verifyAdmin = (req, res, next) => {

    // console.log("Result from the verifyAdmin method:");
    // console.log(req.user);

    // If the user's isAdmin is true, the process will continue to the next middleware
    if(req.user.isAdmin) {
        next()
    // Else, the user is not an admin and they cannot proceed.
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
};

// [SECTION] Error Handling Middleware

// Error Handler:
// Accepst 4 arguments:
    // err - the error object
    // req and res - the request and response objects
    // next - next() method
module.exports.errorHandler = (err, req, res, next) => {

    // console.log(err);

    // Define a statusCode variable that will accept Server Erro status codes
    const statusCode = err.status || 500;

    const errorMessage = err.message || 'Internal Server Error';

    // Standardize Error Response that can be used to manage and handle error to all our controller functionalities.

    // Send the error message response with an appropriate status code
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    })
};



module.exports.loginLimiter = rateLimit({

    // Defines the time window for the rate limit (15 min)
    // 15 is the number of minutes
    // 60 is the number of seconds in a minute
    // 1000 is the number of miliseconds in a second
    windowMs: 15 * 60 * 1000,
    // Max number of attempts for login
    max: 5,
    message: {
        // Response message when the rate limit exceeds.
        message: "Too many login attempts. Please try again later."
    }

})
