const router = require("express").Router();
const productTypeController = require("../controllers/productTypeController");

router.post("/productType", productTypeController.createProductType);
router.get("/productType", productTypeController.getProductType);
router.put("/productType", productTypeController.updateProductType);
router.delete("/productType", productTypeController.deleteProductType);

module.exports = router;
