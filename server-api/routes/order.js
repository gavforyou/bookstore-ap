const router = require("express").Router();  
const orderController = require("../controllers/order");
const { verify } = require("../auth");  
  
router.get("/", verify, orderController.listMyOrders);  
router.post("/", verify, orderController.createOrder);  
  
module.exports = router;