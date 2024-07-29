const router = require('express').Router();
const orderController = require('../controllers/order.controller');

router.post("/order", orderController.postOrder);
//crear orden

//router.post("/order", orderController.postOrder)

//obtener todas las ordernes  
//router.get("/order", orderController.getOrderById);

module.exports = router; // Corrección aquí
