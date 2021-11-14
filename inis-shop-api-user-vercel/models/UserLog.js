const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    ip: {
        type: String,
        required: false
    },    

    status: {
        type: String,
        required: true
    },   

})


export default mongoose.models.UserLog || mongoose.model('UserLog', UserLogSchema)