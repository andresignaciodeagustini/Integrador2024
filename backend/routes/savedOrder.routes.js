const express = require("express");
const { saveOrderOnLogout, getSavedOrders } = require("../controllers/savedOrder.controller");
const auth = require('../middlewares/auth');
const router = express.Router();

// Guardar pedido al hacer logout
router.post("/savedorder", auth, saveOrderOnLogout);

// Obtener todas las órdenes guardadas, opcionalmente filtrando por idUser
router.get("/savedorder/:idUser?", auth, getSavedOrders);

module.exports = router;
