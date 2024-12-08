const router = require("express").Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const upload = require("../services/uploadImage");
const { authenticate, authorizeAdmin } = require("./authMiddleware");

router.post(
  "/uploadInforClient",
  authenticate,
  upload.createUploader("Banners"),
  adminController.uploadInforClient
);
router.post(
  "/deleteInforClient",
  authenticate,
  adminController.deleteInforClient
);
router.get("/getInforClient", adminController.getInforClient);
router.post("/register", authenticate, authorizeAdmin, authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/getAllAccounts", authController.getAllAccounts);
router.post("/setRole", authenticate, authorizeAdmin, authController.setRole);
router.post(
  "/deleteAccount",
  authenticate,
  authorizeAdmin,
  authController.deleteAccount
);
module.exports = router;
