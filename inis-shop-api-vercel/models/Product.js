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

    spec: {
        type: String, /// json string e.g : {"color" : "red" , "size" : "small", ... }
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

    discount: {
        type: Number,
        default: 0
    }, 
    
    inStock: {
        type: Number,
        default: 0
    },

    categoryId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    lastUpdate: {
        type: Date,
        default: new Date()
    },

    code: {
        type: String,
        required: false
    },

    barCode: {
        type: String,
        required: false
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