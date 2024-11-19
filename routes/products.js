const router = require("express").Router();
const productController = require("../controllers/productController");
const { authenticate, authorizeAdmin } = require("./authMiddleware");
const upload = require("../services/uploadImage");

router.get("/searchProducts", productController.searchProducts);
router.post(
  "/createProduct",
  authenticate,
  authorizeAdmin,
  productController.createProduct
);
router.get("/getAllProducts", productController.getAllProducts);
router.put(
  "/updateProduct",
  authenticate,
  authorizeAdmin,
  productController.updateProduct
);
router.delete(
  "/deleteProduct",
  authenticate,
  authorizeAdmin,
  productController.deleteProduct
);

router.post(
  "/upLoadImage",
  authenticate,
  authorizeAdmin,
  productController.checkIdExit,
  upload.createUploader("Test"),
  productController.updLoadImages
);

router.post(
  "/upLoadImageByUrl",
  authenticate,
  authorizeAdmin,
  productController.checkIdExit,
  productController.updLoadImagesByUrl
);

router.post(
  "/removeImages",
  authenticate,
  authorizeAdmin,
  productController.removeImages
);

module.exports = router;
