const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  
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

    type: {
        type: String,
        required: true
    },

    caption: {
        type: String,
        default: ''
    }, 
    
    imageUrl: {
        type: String,
        required: true
    },

    imageUrlSmall: {
        type: String,
        required: true
    },

    postTimeStamp: {
        type: Date,
        required: true
    },

    likes: {
        type: Number,
        default: 0
    }

})

export default mongoose.models.Post || mongoose.model('Post', PostSchema)