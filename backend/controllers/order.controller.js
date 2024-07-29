const Order = require('../models/order.model');

async function postOrder(req, res) {
    try {
        const order = new Order(req.body);

        const newOrder = await order.save();

        res.status(201).send({
            ok: true,
            message: "Orden creada correctamente",
            order: newOrder
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear producto"
        });
    }
}

module.exports = {
    postOrder
}
