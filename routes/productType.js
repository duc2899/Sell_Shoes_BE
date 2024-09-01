const router = require("express").Router();
const productTypeController = require("../controllers/productTypeController");

router.post("/origins", productTypeController.createProductType);
router.post("/categories", productTypeController.createProductType);
router.get("/origins", productTypeController.getOrigins);
router.get("/categories", productTypeController.getCategories);
router.put("/origins", productTypeController.updateProducType);
router.put("/categories", productTypeController.updateProducType);
router.delete("/origins", productTypeController.deleteProductType);
router.delete("/categories", productTypeController.deleteProductType);
module.exports = router;
