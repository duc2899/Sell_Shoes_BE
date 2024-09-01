const router = require("express").Router();

const producTypeRoutes = require("./productType");
router.use("/api/productType", producTypeRoutes);

module.exports = router;
