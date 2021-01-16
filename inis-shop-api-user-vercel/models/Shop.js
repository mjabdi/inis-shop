const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
 
    timeStamp: {
        type: Date,
        default: new Date()
    },

    name: {
        type: String,
        required: true,
        unique: true
    },

    persianName: {
        type: String,
        required: true,
        unique: true
    },

    id: {
        type: String,
        required: true,
        default: null
    },

    description: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    lastUpdateTimeStamp: {
        type: Date,
        default: null
    },

    isUpdating: {
        type: Boolean,
        default: false
    },

    end_cursor: {
        type: String,
        required: false
    }

})


export default mongoose.models.Shop || mongoose.model('Shop', ShopSchema)