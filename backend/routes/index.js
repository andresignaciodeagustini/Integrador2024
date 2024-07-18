const express = require('express');
const router = express.Router();

const user_routes = require("./user.routes");
const product_routes = require("./product.routes");
const category_routes = require("./category.routes");

router.use ([user_routes,product_routes, category_routes])

module.exports =  router;

