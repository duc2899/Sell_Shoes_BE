const router = require("express").Router();

const producTypeRoutes = require("./productType");
const productRoutes = require("./products");
const clientRoutes = require("./client");

router.use("/api/sellShoe", producTypeRoutes);
router.use("/api/sellShoe", productRoutes);
router.use("/api/client/sellShoe", clientRoutes);

module.exports = router;
