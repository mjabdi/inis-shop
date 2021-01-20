const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    orderId: {
        type: String,
        required: true
    },    

    shopId: {
        type: String,
        required: true
    },   

    productId: {
        type: String,
        required: true
    },

    variant: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    count: {
        type: Number,
        required: true  
    },
})


export default mongoose.models.OrderDetail || mongoose.model('OrderDetail', OrderDetailSchema)