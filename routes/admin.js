const router = require("express").Router();
const adminController = require("../controllers/adminController");
const upload = require("../services/uploadImage");

router.post(
  "/uploadInforClient",
  upload.createUploader("Banners"),
  adminController.uploadInforClient
);
router.post("/deleteInforClient", adminController.deleteInforClient);
router.get("/getInforClient", adminController.getInforClient);

module.exports = router;
