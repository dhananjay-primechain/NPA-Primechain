'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assetSchema = mongoose.Schema({
    assetName:String,
    fromAddress:String,
    toAddress:String,
    assetHolder:String,
    issuedQty:String,
    transactionId:String,
    assetref:String,
    availableQty:String
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });

mongoose.connect('mongodb+srv://jay:jay12345@cluster0-gxxyr.mongodb.net/NPA');

module.exports = mongoose.model('asset', assetSchema);