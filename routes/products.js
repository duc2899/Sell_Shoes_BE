const router = require("express").Router();
const productController = require("../controllers/productController");
const upload = require("../services/uploadImage");


router.post("/createProduct", productController.createProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.put("/updateProduct", productController.updateProduct);
router.delete("/deleteProduct", productController.deleteProudct);
router.post(
  "/upLoadImage",
  productController.checkIdExit,
  upload,
  productController.updLoadImage
);

module.exports = router;
