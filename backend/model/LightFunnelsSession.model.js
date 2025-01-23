const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lightFunnelsSessionSchema = new Schema({
    ownerId: {
        type: String,
    },
    accessToken: {
        type: String,
        required: true
    },
    storeName: {
        type: String,
        default: null
    },
    storeId: {
        type: String,
        default: null
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    storeSelected: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    },
    { timestamps: true }
);

const LightFunnelsSession = mongoose.model('LightFunnelsSession', lightFunnelsSessionSchema);
module.exports = LightFunnelsSession;