const SavedOrder = require("../models/savedOrder.model");

// Guardar pedido al hacer logout
async function saveOrderOnLogout(req, res) {
    try {
        const { userId, products, total } = req.body;

        // Crear una nueva instancia de SavedOrder sin verificaciones adicionales
        const savedOrder = new SavedOrder({ 
            user: userId, 
            products, 
            total 
        });

        await savedOrder.save();

        res.status(201).json({ message: "Order saved on logout", order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error saving order", error: error.message });
    }
}

// Obtener todas las órdenes guardadas para un usuario
async function getSavedOrders(req, res) {
    try {
        const userId = req.params.idUser || req.user.id; // Obtener idUser de los parámetros de la URL o del usuario autenticado

        const savedOrders = await SavedOrder.find({ user: userId });

        res.status(200).json({ orders: savedOrders });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving saved orders", error: error.message });
    }
}

module.exports = { saveOrderOnLogout, getSavedOrders };
