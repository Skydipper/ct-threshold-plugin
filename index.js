const debug = require('debug')('threshold-plugin');
const mongoose = require('mongoose');
const thresholdService = require('./lib/threshold.service');
const thresholdRouter = require('./lib/threshold.router');

function init() {

}

function middleware(app, plugin, generalConfig) {
    const connection = mongoose.createConnection(`${generalConfig.mongoUri}`);
    debug('Loading threshold-plugin');
    app.use(thresholdService(connection).middleware);
    app.use(thresholdRouter(connection).middleware());
}


module.exports = {
    middleware,
    init,
};
