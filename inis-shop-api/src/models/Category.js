const mongoose = require('mongoose');

const Category = mongoose.model('category', new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    title: {
        type: String,
        required: true
    },    

    description: {
        type: String,
        required: false
    },   

    parentId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

}));


exports.Category = Category; 