const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

let threshold = null;
function thresholdModel(connection) {
    if (threshold) {
        return threshold;
    }

    const Threshold = new Schema({
        applicationSlug: { type: String, required: true, trim: true, unique: true, index: true },
        maxRequest: { type: Number, required: true, trim: true, default: -1 },
        interval: { type: String, required: true, trim: true, default: 'daily' }
    });
    threshold = connection.model('Threshold', Threshold);
    return threshold;
}

module.exports = thresholdModel;
