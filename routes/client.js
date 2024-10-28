const router = require("express").Router();
const clientController = require("../controllers/clientController");
router.get("/getAllCategories", clientController.getAllCategories);
router.get(
  "/getAllOriginsWithDesigns",
  clientController.getAllOriginsWithDesigns
);

module.exports = router;
