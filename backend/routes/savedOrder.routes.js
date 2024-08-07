const express = require("express");
const { saveOrderOnLogout, getSavedOrders } = require("../controllers/savedOrder.controller");
const auth = require('../middlewares/auth');
const router = express.Router();

router.post("/savedorder", auth, saveOrderOnLogout);
router.get("/savedorder/:idUser?", auth, getSavedOrders);

module.exports = router;
