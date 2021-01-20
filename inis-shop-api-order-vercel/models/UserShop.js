const mongoose = require('mongoose');

const UserShopSchema = new mongoose.Schema({
 
    timeStamp: {
        type: Date,
        default: Date()
    },
    
    userId: {
        type: String,
        required: true,
    },

    shopId: {
        type: String,
        required: true,
    },

    isOwner: {
        type: Boolean,
        required: true,
    },

    accessList: {
        type: String,
        required: false
    },
})


export default mongoose.models.UserShop || mongoose.model('UserShop', UserShopSchema)