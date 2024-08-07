const PreviousOrder = require('../models/previousorder.model');
const User = require('../models/user.model');

// Obtener todas las órdenes anteriores de un usuario específico
async function getPreviousOrdersByUserId(req, res) {
    try {
        const userId = req.params.userId;
        const previousOrders = await PreviousOrder.find({ user: userId });

        res.status(200).send({
            ok: true,
            message: "Órdenes anteriores obtenidas correctamente",
            previousOrders
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener órdenes anteriores"
        });
    }
}

// Obtener una orden anterior por ID
async function getPreviousOrderById(req, res) {
    try {
        const id = req.params.id;
        const previousOrder = await PreviousOrder.findById(id);

        if (!previousOrder) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró la orden anterior"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Orden anterior encontrada",
            previousOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener la orden anterior"
        });
    }
}

// Crear una nueva orden anterior
async function createPreviousOrder(req, res) {
    try {
        const { userId, products } = req.body;
        const newOrder = new PreviousOrder({ user: userId, products });
        const savedOrder = await newOrder.save();

        // Asocia la nueva orden al usuario
        await User.findByIdAndUpdate(userId, { $push: { previousOrders: savedOrder._id } });

        res.status(201).send({
            ok: true,
            message: "Orden anterior creada correctamente",
            savedOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear la orden anterior"
        });
    }
}

// Añadir un producto a una orden anterior
async function addProductToPreviousOrder(req, res) {
    try {
        const orderId = req.params.orderId;
        const { productId, price, quantity } = req.body;

        const order = await PreviousOrder.findById(orderId);

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        order.products.push({ product: productId, price, quantity });
        await order.save();

        res.status(200).send({
            ok: true,
            message: "Producto añadido correctamente",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al añadir producto a la orden"
        });
    }
}

// Vaciar una orden anterior
async function emptyPreviousOrder(req, res) {
    try {
        const orderId = req.params.orderId;

        const order = await PreviousOrder.findById(orderId);

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        order.products = [];
        await order.save();

        res.status(200).send({
            ok: true,
            message: "Orden vaciada correctamente",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al vaciar la orden"
        });
    }
}

// Eliminar una orden anterior
async function deletePreviousOrder(req, res) {
    try {
        const orderId = req.params.orderId;

        const deletedOrder = await PreviousOrder.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        // Eliminar la referencia a la orden en el usuario
        await User.updateMany({ previousOrders: orderId }, { $pull: { previousOrders: orderId } });

        res.status(200).send({
            ok: true,
            message: "Orden eliminada correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al eliminar la orden"
        });
    }
}

module.exports = {
    getPreviousOrdersByUserId,
    getPreviousOrderById,
    createPreviousOrder,
    addProductToPreviousOrder,
    emptyPreviousOrder,
    deletePreviousOrder
};
