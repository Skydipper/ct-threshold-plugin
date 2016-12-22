const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

let request = null;
function requestModel(connection) {
    if (request) {
        return request;
    }

    const Request = new Schema({
        applicationSlug: { type: String, required: true, trim: true },
        source: { type: String, required: false, trim: true },
        date: { type: Date, required: true, trim: true, default: Date.now },
        revoked: { type: Boolean, required: true, default: false }
    });
    request = connection.model('Request', Request);
    return request;
}

module.exports = requestModel;
