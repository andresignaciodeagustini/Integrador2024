const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema de Usuario
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    previousOrders: [{ type: Schema.Types.ObjectId, ref: 'PreviousOrder' }]
});

module.exports = mongoose.model('User', userSchema);
