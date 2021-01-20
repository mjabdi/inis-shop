const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  
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

})


export default mongoose.models.Category || mongoose.model('Category', CategorySchema)