const express = require("express");
const router = express.Router();
const UsersRoutes = require("./Users");
const ProductsRoutes = require("./Products");

router.use(UsersRoutes);
router.use(ProductsRoutes);

module.exports = router;