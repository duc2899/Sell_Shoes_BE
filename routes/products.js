const router = require("express").Router();
const productController = require("../controllers/productController");

router.post("/createProduct", productController.createProduct);
router.get("/getAllProducts", productController.getAllProducts)

module.exports = router