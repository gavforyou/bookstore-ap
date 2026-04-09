const router = require("express").Router();  
const userController = require("../controllers/user");  
const { verify, requireAdmin } = require("../auth");  
   
router.post("/register", userController.register);  
router.post("/login", userController.login);  
router.get("/profile", verify, userController.profile);  
   
router.put("/updateAdmin", verify, requireAdmin, userController.updateAdmin);  
   
module.exports = router;