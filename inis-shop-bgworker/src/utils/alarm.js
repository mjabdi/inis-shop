
const {Notification} = require('../models/Notification');
const logger = require('./logger')();

const sendInstagramFailedAlarm = async () =>
{
    const notification = new Notification(
        {
            timeStamp : new Date(),
            text : 'Instagram Connection Failed!',
            type: 'Instagram Connection'
        }
    );

        notification.save( (err,doc) => {
            if (err)
            {
                logger.error(err);
            }
            else if (doc)
            {
                logger.warn(`Instagram Connection Failed Alarm Sent to the notification system!`);
            }
        });
    
}


module.exports = {
    sendInstagramFailedAlarm : sendInstagramFailedAlarm,
}