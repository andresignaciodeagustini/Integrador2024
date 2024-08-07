const express = require('express');
const router = express.Router();
const { getPreviousOrdersByUserId, getPreviousOrderById, createPreviousOrder, addProductToPreviousOrder, emptyPreviousOrder, deletePreviousOrder } = require('../controllers/previousonpmrder.controller');

// Obtener todas las órdenes anteriores de un usuario
router.get('/user/:userId', getPreviousOrdersByUserId);

// Obtener una orden anterior por ID
router.get('/:id', getPreviousOrderById);

// Crear una nueva orden anterior
router.post('/', createPreviousOrder);

// Añadir un producto a una orden anterior
router.put('/:orderId/product', addProductToPreviousOrder);

// Vaciar una orden anterior
router.patch('/:orderId/empty', emptyPreviousOrder);

// Eliminar una orden anterior
router.delete('/:orderId', deletePreviousOrder);

module.exports = router;
