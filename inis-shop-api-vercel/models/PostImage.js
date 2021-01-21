const mongoose = require('mongoose');

const PostImageSchema = new mongoose.Schema({
  
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

    shortCode:{
        type: String,
        required: false
    },

    isMainImage: {
        type: Boolean,
        default: false
    }

})


export default mongoose.models.PostImage || mongoose.model('PostImage', PostImageSchema)