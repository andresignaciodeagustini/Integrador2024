const Order = require('../models/order.model');
const Product = require('../models/product.model');

async function postOrder(req, res) {
    try {

        if (req.user._id !== req.body.user){
            return res.status(400).send({
                ok:false,
                message: "No puedes crear una orden para otro usuario"
            })
        }
        if (req.body.products.length == 0){
            return res.status(400).send({
                ok:false,
                message: "No puedes crear una orden para otro usuario"
            })
        }




        // Validar productos antes de crear la orden
        await orderProductPriceVerification(req.body.products, req.body.total);

        const order = new Order(req.body);
        const newOrder = await order.save();

        res.status(201).send({
            ok: true,
            message: "Orden creada correctamente",
            order: newOrder
        });
    } catch (error) {
        console.log(error); // Puedes mantener esto para monitoreo en producción
        res.status(500).send({
            ok: false,
            message: error.message || "Error al crear orden"
        });
    }
}

async function orderProductPriceVerification(products, total) {
    try {
        let totalOrder = 0;

        for (let prod of products) {
            totalOrder += prod.price * prod.quantity;
            const product = await Product.findById(prod.product);

            if (!product || product.price !== prod.price) {
                throw new Error(`El producto con id ${prod.product} no existe o el precio no coincide`);
            }
        }

        if (totalOrder !== total) {
            throw new Error("El total no es correcto");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al verificar precios");
    }
}

async function getOrders(req, res) {
    try {
        const id = req.params.id;
        let filter;

        if (req.user.role === "ADMIN_ROLE") {
            filter = id ? { user: id } : {};
        } else {
            filter = { user: req.user._id };
        }

        const orders = await Order.find(filter)
            .populate("user", "fullName")
            .populate("products.product");

        return res.status(200).send({
            ok: true,
            message: "Ordenes obtenidas correctamente",
            orders // Devolver las órdenes obtenidas
        });
    } catch (error) {
        console.log(error); // Puedes mantener esto para monitoreo en producción
        res.status(500).send({
            ok: false,
            message: "Error al obtener ordenes"
        });
    }
}

module.exports = {
    postOrder,
    getOrders,
    orderProductPriceVerification // Exportar la función `getOrders`
};
