// models/previousorder.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const previousOrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: [productSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: "previous" }
}, { collection: 'previousorders' }); // Especifica el nombre de la colección

module.exports = mongoose.model('PreviousOrder', previousOrderSchema);
