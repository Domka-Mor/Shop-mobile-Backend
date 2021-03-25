const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subtotal: { type: Number, default: 0 , required: true },
    tax: { type: Number, default: 0 , required: true },
    total: { type: Number, default: 0 , required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'order created'},
    orders: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Order', orderSchema);