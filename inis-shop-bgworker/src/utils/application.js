const application = {};

const config = require('config');
const logger = require('./logger')();


application.shutdown = () => {

    logger.info('application is shutting down ...');

    logger.flush();

    if (application.serviceArray)
    {
        application.serviceArray.forEach(service => {
            service.stop();
        });
    }

    setTimeout(() => {
        process.exit(0);
    }, config.ShutdownTimeout || 3000);
}

application.registerForGracefulShutdown = (serviceArray) => {
    
    application.serviceArray = serviceArray;

    process.on('SIGTERM', () => {
        if (!application.exitSignalReceived) {
            application.exitSignalReceived = true;
            logger.info('SIGTERM signal received.');
            application.shutdown();
        }
        else {
            console.log('application is shutting down. please wait...');
        }
    });

    process.on('SIGINT', () => {
        if (!application.exitSignalReceived) {
            application.exitSignalReceived = true;
            logger.info('SIGINT signal received.');
            application.shutdown();
        }
        else {
            console.log('application is shutting down. please wait...');
        }
      });
}

application.registerGlobalErrorHandler = () =>
{
    process.on('uncaughtException', (err) => {
        if (!application.exitSignalReceived)
        {
            application.exitSignalReceived = true;
            logger.fatal(`Uncaught Exception occured : ${err.stack}`);
            application.shutdown();
        }
        else
        {
            console.log('application is shutting down. please wait...');
        }
    });

    process.on('unhandledRejection', (err) => {
        if (!application.exitSignalReceived)
        {
            application.exitSignalReceived = true;
            logger.fatal(`Unhandled Promise Rejection occured : ${err.stack}`);
            application.shutdown();
        }
        else
        {
            console.log('application is shutting down. please wait...');
        }
    });
}

module.exports = application;
