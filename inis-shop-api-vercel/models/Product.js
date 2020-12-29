const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    shopId: {
        type: String,
        required: true
    },    

    postId: {
        type: String,
        required: true
    },   

    title: {
        type: String,
        required: true
    },

    variant: {
        type: String,
        default: null
    },

    description: {
        type: String,
        required: false
    },

    keywords: {
        type: String, /// comma seperated keywords e.g: "digital, ipad, phone, ...."
        required: false
    },

    price: {
        type: Number,
        required: true
    },

    priceAfterDiscount: {
        type: Number,
        default: 0
    }, 
    
    inStock: {
        type: Number,
        default: 0
    },

    trackQuantity:{
        type: Boolean,
        required: true,
        default: false
    },

    continueAfterSoldout:{
        type: Boolean,
        required: true,
        default: false
    },

    lastUpdate: {
        type: Date,
        default: new Date()
    },

    SKUCode: {
        type: String,
        required: false
    },

    barCode: {
        type: String,
        required: false
    },

    imageUrl: {
        type: String,
        required: true
    },

    imageUrlSmall: {
        type: String,
        required: true
    },

    deleted: {
      type: Boolean,
      required: false
    },

    history: {
        type: Array,
        required: false
    }

})


export default mongoose.models.Product || mongoose.model('Product', ProductSchema)