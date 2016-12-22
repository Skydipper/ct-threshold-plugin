const debug = require('debug')('threshold-plugin');
const thresholdFunction = require('./threshold.model');
const requestFunction = require('./request.model');


function getService(connection) {

    const ThresholdModel = thresholdFunction(connection);
    const RequestModel = requestFunction(connection);

    class StadisticService {

        static getDateFilters(period) {
            const now = new Date();
            if (period === 'daily') {
                return {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                };
            } else if (period === 'weekly') {
                return {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
                };
            } else if (period === 'monthly') {
                return {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lte: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
                };
            }
            return {};
        }

        static validSource(origin, allowedDomains) {
            // TODO: Check domains
            return true;
        }

        static async middleware(ctx, next) {
            try {
                if (ctx.application) {
                    debug('Checking if this application has threshold');
                    const thresholdInfo = await ThresholdModel.findOne({ applicationSlug: ctx.application.slug });
                    if (thresholdInfo.maxRequest > -1) {
                        debug('Obtaining count');

                        const count = await RequestModel.count({ applicationSlug: ctx.application.slug, date: StadisticService.getDateFilters(thresholdInfo.period), revoked: false });
                        let revoked = false;
                        if (count >= thresholdInfo.maxRequest || !StadisticService.validSource(ctx.headers.origin, ctx.application.allowedDomains)) {
                            revoked = true;
                        }
                        await new RequestModel({ applicationSlug: ctx.application.slug, source: ctx.headers.origin, revoked }).save();
                        if (revoked) {
                            ctx.throw(429, 'Threshold exceeded');
                            return;
                        }
                    }
                }
                await next();
            } catch (e) {
                throw e;
            }
        }

    }
    return StadisticService;
}
module.exports = getService;
