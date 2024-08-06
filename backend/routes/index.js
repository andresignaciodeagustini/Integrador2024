const express = require('express');
const router = express.Router();

const user_routes = require("./user.routes");
const product_routes = require("./product.routes");
const category_routes = require("./category.routes");
const order_routes = require("./order.routes");
const previousorder_routes = require("./previousorder.routes"); // Importa las rutas de PreviousOrder
const auth = require('../middlewares/auth'); // Importa el middleware de autenticación

// Usa el middleware de autenticación para todas las rutas
router.use(auth);

// Define las rutas
router.use([
    user_routes,
    product_routes,
    category_routes,
    order_routes,
    previousorder_routes // Agrega las rutas de PreviousOrder
]);

module.exports = router;
