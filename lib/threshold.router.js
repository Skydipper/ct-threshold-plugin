const debug = require('debug')('threshold-plugin');
const Router = require('koa-router');
const thresholdFunction = require('./threshold.model');
const ApiRouter = new Router({
    prefix: '/api/v1/threshold',
});


function getMiddleware(connection) {
    const ThresholdModel = thresholdFunction(connection);

    class ThresholdRouter {

        static async get(ctx) {
            debug('Obtaining thresholds');
            ctx.body = await ThresholdModel.find().sort('-date').exec();
        }

    }

    ApiRouter.get('/', ThresholdRouter.get);

    return ApiRouter;
}
module.exports = getMiddleware;
