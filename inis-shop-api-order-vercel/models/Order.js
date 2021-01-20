const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    shopId: {
        type: String,
        required: true
    },    

    orderId: {
        type: String,
        required: true
    },   

    customerId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true  
    },

    shippingAddress: {
        type: String,
        required: true
    },

    shippingMethod: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    orderTotalPrice: {
        type: Number,
        required: true
    },

    shippingPrice: {
        type: Number,
        required: true
    }


})


export default mongoose.models.Order || mongoose.model('Order', OrderSchema)