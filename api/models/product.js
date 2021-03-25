const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    productImage: {
        type: Array,
        default: []
    },
    price: { type: Number, required: true },
    company: { type: String, required: true },
    info: { type: String, required: true },
    featured: { type: Boolean, default: false, required: true },
    featuredInfo: {type: String}
});

module.exports = mongoose.model('Product', productSchema);