'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://cluster0-gxxyr.mongodb.net:27017/NPA');
var db = mongoose.connection
console.log(db)

const bidSchema = mongoose.Schema({
   bidId:Number,
   assetRef:Number,
   ID:{ type: String, unique: true },
});

module.exports = mongoose.model('bids', bidSchema);