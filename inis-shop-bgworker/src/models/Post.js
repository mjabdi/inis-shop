const mongoose = require('mongoose');

const Post = mongoose.model('post', new mongoose.Schema({
  
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
    
    shortCode:{
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

}));


exports.Post = Post; 