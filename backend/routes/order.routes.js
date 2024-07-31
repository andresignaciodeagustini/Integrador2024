const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth');

// Crear orden
router.post("/orders", auth, orderController.postOrder);

// Obtener todas las órdenes
router.get("/orders/:idUser?", auth, orderController.getOrders);

module.exports = router;