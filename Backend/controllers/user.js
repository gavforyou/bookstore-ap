/* s46 ACTIVITY SOLUTION START */
//[SECTION] Dependencies and Modules
const User = require('../models/User');
// Import the bcryptjs package to have access to hashing feature.
const bcrypt = require('bcryptjs');
// Import the auth.js file to have access to authentication middlewares
const auth = require("../auth");

// Import the errorHandler middleware
const { errorHandler } = require("../auth");


/* Updated s48 ACTIVITY SOLUTION START */
//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.checkEmailExists = (req, res) => {

    // Add a validation to check if email syntax is valid
    if(req.body.email.includes("@")) {
        // The result is sent back to the client via the "then" method found in the route file
        return User.find({ email : req.body.email })
        .then(result => {

            // The "find" method returns a record if a match is found
            if (result.length > 0) {

                return res.status(409).send({message: "Duplicate email found"});

            // No duplicate email found
            // The user is not yet registered in the database
            } else {

                // 404 - means not found
                // but since there's no duplicate email we should allow the user to proceed with the registration, so we use http status 200
                return res.status(200).send({message: "No duplicate email found"});
            };
        })
        .catch(error => errorHandler(error, req, res))
    } else {
        // if email does not contain an "@" symbol send back a bad request status code and a boolean false to indicate invalid input.
        res.status(400).send({message: "Invalid email format"});        
    }
    
};
/* ACTIVITY SOLUTION END */


//[SECTION] User Registration
// module.exports.registerUser = (req, res) => {
//     let newUser = new User({
//         firstName : req.body.firstName,
//         lastName : req.body.lastName,
//         email : req.body.email,
//         mobileNo : req.body.mobileNo,
//         // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
//         password : bcrypt.hashSync(req.body.password, 10)
//     })

//     return newUser.save()
//     .then((result) => res.status(201).send(result))
//     .catch(error => errorHandler(error, req, res))
// };

/* s51-s52 ACTIVITY SOLUTION START */
//[SECTION] User Registration
module.exports.registerUser = (req, res) => {

    console.log(typeof req.body.firstName);

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({message: "Invalid email format"});
    }
    else if(typeof req.body.firstName !== "string" || typeof req.body.lastName !== "string") {
         return res.status(400).send({message: "Invalid first name or last name"});
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({message: "Mobile number is invalid"});
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({message: "Password must be at least 8 characters"});
    // If all needed requirements are achieved
    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({
            message: "User registered succesfully",
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
        
    }
};
/* ACTIVITY SOLUTION END */


//[SECTION] User authentication
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {

    // Allow user to log in if email syntaxt is valid
    if(req.body.email.includes("@")) {
        // The "findOne" method returns the first record in the collection that matches the search criteria
        // We use the "findOne" method instead of the "find" method which returns all records that match the search criteria
        return User.findOne({ email : req.body.email })
        .then(result => {

            // User does not exist
            if(result == null){

                return res.status(404).send({ message: 'No email found' });

            // User exists
            } else {

                // Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
                // The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
                // A good coding practice for boolean variable/constants is to use the word "is" or "are" at the beginning in the form of is+Noun
                    //example. isSingle, isDone, isAdmin, areDone, etc..
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                // If the passwords match/result of the above code is true
                if (isPasswordCorrect) {

                    // Generate an access token
                    // Uses the "createAccessToken" method defined in the "auth.js" file
                    // Returning an object back to the client application is common practice to ensure information is properly labeled and real world examples normally return more complex information represented by objects
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                    });
                // Passwords do not match
                } else {

                    return res.status(401).send({ message: 'Incorrect email or password' });

                }

            }

        })
        .catch(error => errorHandler(error, req, res))
    } else {
        // Do not allow user to log in if email does not follow the correct syntax.
        res.status(400).send({ message: 'Invalid email format' });
    }
    
};



/* ACTIVITY SOLUTION END */


// module.exports.getProfile = (reqBody) => {
//     return User.findById(reqBody.id)
//     .then(result => result)
//     .catch(err => err)
// };
/* ACTIVITY SOLUTION END */


/* s47 ACTIVITY SOLUTION START */
//[Section] Activity: Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
// module.exports.getProfile = (userId) => {

//     return User.findById(userId)
//     .then(result => {
//         result.password = "*****";
//         return result;
//     })
//     .catch(err => err)
// };
/* ACTIVITY SOLUTION END */



/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
// The "getProfile" method now has access to the "req" and "res" objects because of the "next" function in the "verify" method.
module.exports.getProfile = (req, res) => {

    console.log("Result of Request user object:");
    console.log(req.user)
    console.log(req.user.id)

    return User.findById(req.user.id)
    .then(user => {

        if(!user) {
            return res.status(403).send({ message: 'User not found' });
        } else {
            user.password = "*****";
        // Add a status 200 when we send the response back to client
        res.status(200).send(user);
        }    
    })
    .catch(error => errorHandler(error, req, res))
};



module.exports.resetPassword = async (req, res) => {
    try {
        
        console.log(req.user.id);

        const userId = req.user.id; // assuming token contains { id: <userId> }

        // 3. Get new password from body
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required." });
        }

        // 4. Hash new password
        const hashedPassword = await bcrypt.hashSync(newPassword, 10);

        console.log(hashedPassword)

        let updatedPassword = {
            password: hashedPassword
        }


        // 5. Update user password in DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        ); 

        console.log(updatedUser)


        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Password reset successful." });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error." });
    }
};


module.exports.updateProfile = async (req, res) => {
    try {
        
        console.log(req.user.id)

        const userId = req.user.id; // token payload should be { id: <userId> }

        // Allowed fields to update
        const { firstName, lastName, mobileNo } = req.body;

        // Update user document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(mobileNo && { mobileNo })
            },
            { new: true }
        ).select("-password"); // exclude password from returned data

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



exports.setAsAdmin = async (req, res) => {
    try {
        
        // const adminId = req.user.id;

        // // 3. Check if requesting user is admin
        // const adminUser = await User.findById(adminId);
        // if (!adminUser || !adminUser.isAdmin) {
        //     return res.status(403).json({ message: "Access denied: Admin only" });
        // }

        // 4. Get target user ID from params
        const { userId } = req.params;

        // 5. Update second user to admin
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAdmin: true },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Target user not found" });
        }

        return res.status(200).json({
            message: "User successfully promoted to admin",
            user: updatedUser
        });

    } catch (error) {
        console.error("Promote admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
