const express = require('express');
const router = express.Router();
const previousOrderController = require('../controllers/previousorder.controller');
const authMiddleware = require('../middlewares/auth'); // Asegúrate de que la ruta del middleware sea correcta

// Middleware para verificar que el usuario esté autenticado (opcional)
router.use(authMiddleware);

// Ruta para crear o actualizar una PreviousOrder
router.post('/previousorder', previousOrderController.updatePreviousOrder);

// Ruta para obtener la PreviousOrder del usuario autenticado
router.get('/previousorder', previousOrderController.getPreviousOrder);

// Ruta para obtener una PreviousOrder de un usuario específico por ID
router.get('/previousorder/:userId', previousOrderController.getPreviousOrderById);

// Ruta para confirmar una orden
router.post('/order/confirm', previousOrderController.confirmOrder);

module.exports = router;
