const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const previousOrderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    products: [{
        product: { 
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'Product' 
        },
        price: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1, 
            default: 1 
        }
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para actualizar el campo `updatedAt` automáticamente
previousOrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Agregar índice para el campo `user`
previousOrderSchema.index({ user: 1 });

module.exports = mongoose.model('PreviousOrder', previousOrderSchema, 'previousorders');
