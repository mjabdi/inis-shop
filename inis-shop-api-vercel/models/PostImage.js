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

    id: {
        type: String,
        required: true
    },   

    imageUrl: {
        type: String,
        required: true
    },

    imageUrlSmall: {
        type: String,
        required: true
    },

    isMainImage: {
        type: Boolean,
        default: false
    }

})


export default mongoose.models.PostImage || mongoose.model('PostImage', PostImageSchema)