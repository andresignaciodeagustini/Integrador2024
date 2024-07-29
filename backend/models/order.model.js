const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = ({

    products: [{
        id:{type: Schema.Types.ObjectId, required: true},
        price: {type:Number, required:true, min:0, max:100000000},
        quantity: {type:Number, required:true, min:1, default: 1},
         }
],

    user:{type: Schema.Types.ObjectId, required: true},
    createdAt:{ type:Number, default: Date.now
    },
    updatedAt:{ type:Number, default: Date.now
    },
    status:{
        type: String,
        required: true,
        default: "open",
        enum: [ "open", "inprogress", "delivered", "cacelled"]
    },
    active: {type: Boolean, default: true}


})

module.exports = mongoose.model ('Order', orderSchema)