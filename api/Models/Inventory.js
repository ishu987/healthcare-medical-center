const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    productType: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    pricePerItem: {
        type: String,
        required: true,
    },
    manufactureDate: {
        type: String,
        required: true,
    },
    expiredDate: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    brand: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);