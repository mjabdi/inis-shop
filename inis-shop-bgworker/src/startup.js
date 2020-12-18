require('events').EventEmitter.defaultMaxListeners = 0;

const checkConfig =  require('./startup/config');
const application = require('./utils/application');
const mongodb = require('./mongodb');
const {recoverFailedDownloads} = require('./db-recovery');
const instagramFeedService = require('./InstagramFeedService');

let ready = false;

async function run()
{
    //** Gobal Error Handling */
    application.registerGlobalErrorHandler();
    //** */

    //** checking for required configs */
    checkConfig();
    //** */

    await mongodb();

    await recoverFailedDownloads();

    instagramFeedService.start();

  

    //** doing all the neccessary things and cleanup procedures before shutdown  */
    application.registerForGracefulShutdown([instagramFeedService]);
    //** */
    
    ready = true;
}

run();

module.exports.ready = () => {return ready};
module.exports.live = () => {return ready};