const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// Deconstruct the auth.js file and pass the verify middleware
const { verify, loginLimiter, verifyAdmin } = require("../auth");

const {validateRegister, validateLogin} = require("../validators/userValidator");





// console.log(userController);

/* s48 ACTIVITY SOLUTION START */
router.post("/check-email", userController.checkEmailExists);

// Add the validateRegiter before the controller to prevent malformed inputs
router.post("/register", validateRegister, userController.registerUser);

// Add the login limiter to prevent Brute-Force Attacks
// Add the validateLogin before the controller to prevent maliscious login attempts.
router.post("/login", loginLimiter, validateLogin, userController.loginUser);

// Route to get user details
router.get("/details", verify, userController.getProfile);
/* ACTIVITY SOLUTION END */


/* s47 ACTIVITY SOLUTION START */
// router.post("/check-email", (req, res) => {
//     userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
// });
// /* ACTIVITY SOLUTION END */

// router.post("/register", (req, res) => {
//     userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
// })

// router.post("/login", (req, res) => {
//     userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
// })

/* s47 ACTIVITY SOLUTION START */
// router.get("/details", verify, (req, res) => {

//     console.log("Result from the /details route:")
//     console.log(req.user);

//     userController.getProfile(req.user.id).then(resultFromController => res.send(resultFromController));
// })
/* ACTIVITY SOLUTION END */

router.get("/details", verify, userController.getProfile);



// PATCH /users/reset-password
router.patch('/reset-password', verify, userController.resetPassword);



// PUT /api/users/update-profile
router.put("/update-profile", verify, userController.updateProfile);


// PUT /api/admin/promote/:userId
router.patch("/set-as-admin/:userId", verify, verifyAdmin, userController.setAsAdmin);



module.exports = router;
