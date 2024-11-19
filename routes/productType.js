const router = require("express").Router();
const productTypeController = require("../controllers/productTypeController");
const { authenticate } = require("./authMiddleware");

router.post(
  "/productType",
  authenticate,
  productTypeController.createProductType
);
router.get("/productType", productTypeController.getProductType);
router.put(
  "/productType",
  authenticate,
  productTypeController.updateProductType
);
router.delete(
  "/productType",
  authenticate,
  productTypeController.deleteProductType
);

module.exports = router;
