const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100,
        trim: true
    },
    bornDate: {
        type: Date,
        required: true
    },
    location: {
        type: String
    },
    role: {
        type: String,
        default: "CLIENT_ROLE",
        enum: ["ADMIN_ROLE", "CLIENT_ROLE", "USER_ROLE"]
    },
    previousOrders: [{ type: Schema.Types.ObjectId, ref: 'PreviousOrder' }] // Agrega esta línea
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);