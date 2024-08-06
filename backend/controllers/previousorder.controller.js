const PreviousOrder = require('../models/previousorder.model'); // Corregido: nombre del archivo de modelo
const Order = require('../models/order.model'); // Corregido: nombre del archivo de modelo

// Crear o Actualizar PreviousOrder
async function updatePreviousOrder(req, res) {
    try {
        const userId = req.user._id;
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).send({
                ok: false,
                message: "El formato de productos es inválido"
            });
        }

        let previousOrder = await PreviousOrder.findOne({ user: userId });
        if (!previousOrder) {
            previousOrder = new PreviousOrder({ user: userId, products });
        } else {
            previousOrder.products = products;
        }

        await previousOrder.save();

        res.status(200).send({
            ok: true,
            message: "PreviousOrder actualizada correctamente",
            previousOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al actualizar la PreviousOrder"
        });
    }
}

// Obtener PreviousOrder para el usuario autenticado
async function getPreviousOrder(req, res) {
    try {
        const userId = req.user._id;

        const previousOrder = await PreviousOrder.findOne({ user: userId }).populate("products.product");
        if (!previousOrder) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró la PreviousOrder"
            });
        }

        res.status(200).send({
            ok: true,
            message: "PreviousOrder obtenida correctamente",
            previousOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener la PreviousOrder"
        });
    }
}

// Obtener PreviousOrder por ID de usuario (para solicitudes específicas)
async function getPreviousOrderById(req, res) {
    try {
        const { userId } = req.params; // Obtiene el ID del usuario de los parámetros de la URL

        // Busca la PreviousOrder para el usuario específico
        const previousOrder = await PreviousOrder.findOne({ user: userId }).populate("products.product");
        if (!previousOrder) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró la PreviousOrder"
            });
        }

        res.status(200).send({
            ok: true,
            message: "PreviousOrder obtenida correctamente",
            previousOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener la PreviousOrder"
        });
    }
}

// Confirmar Orden
async function confirmOrder(req, res) {
    try {
        const userId = req.user._id;

        const previousOrder = await PreviousOrder.findOne({ user: userId });
        if (!previousOrder) {
            return res.status(400).send({
                ok: false,
                message: "No hay productos en la PreviousOrder"
            });
        }

        const order = new Order({
            user: userId,
            products: previousOrder.products
        });
        const newOrder = await order.save();

        await PreviousOrder.deleteOne({ user: userId });

        res.status(201).send({
            ok: true,
            message: "Orden creada correctamente",
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al confirmar la orden"
        });
    }
}

module.exports = {
    updatePreviousOrder,
    getPreviousOrder,
    getPreviousOrderById,
    confirmOrder
};
