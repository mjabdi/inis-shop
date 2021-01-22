const mongoose = require('mongoose');

const PostImage = mongoose.model('PostImage', new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    shopId: {
        type: String,
        required: true
    },    

    parentId: {
        type: String,
        required: true
    },

    id: {
        type: String,
        required: true
    }, 
   
    type: {
        type: String,
        required: true
    },

    imageUrl:{
        type: String,
        required: true
    },

    isMainImage: {
        type: Boolean,
        default: false
    }

}));


exports.PostImage = PostImage; 