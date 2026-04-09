const router = require("express").Router();  
const bookController = require("../controllers/book");
const { verify, requireAdmin } = require("../auth");  
  
router.get("/", bookController.getAll);  
router.get("/:id", bookController.getOne);  
   
router.post("/", verify, requireAdmin, bookController.create);  
  
router.patch("/:id", verify, requireAdmin, bookController.update);  
router.delete("/:id", verify, requireAdmin, bookController.remove);  
  
module.exports = router;