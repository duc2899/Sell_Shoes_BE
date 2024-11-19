const router = require("express").Router();
const clientController = require("../controllers/clientController");
const { authenticate, authorizeAdmin } = require("./authMiddleware");

router.get("/getAllCategories", clientController.getAllCategories);
router.get("/getInforClient", clientController.getInforClient);
router.get("/getHotProducts", clientController.getHotProducts);
router.get("/getProductByName", clientController.getProductByName);
router.get("/getProductsByType", clientController.getProductsByType);
router.get("/getProductsByName", clientController.getProductsByName);
router.post(
  "/getProductsByCode",
  authenticate,
  authorizeAdmin,
  clientController.getProductsByCode
);
router.get(
  "/getAllOriginsWithDesigns",
  clientController.getAllOriginsWithDesigns
);

module.exports = router;
