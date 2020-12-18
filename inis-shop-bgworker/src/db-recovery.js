const dbRecoveryModule = {};

const logger = require('./utils/logger')();
const {Shop} = require('./models/Shop');


dbRecoveryModule.recoverFailedDownloads = async () =>
{
    try
    {
       await Shop.updateMany({isUpdating: true}, {isUpdating: false});
    }
    catch(err)
    {
        logger.error(err);
    }

}

module.exports = dbRecoveryModule;
