'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bidsSchema = mongoose.Schema({
    emailId : String,
    address : String,
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });

mongoose.connect('mongodb+srv://jay:jay12345@cluster0-gxxyr.mongodb.net/NPA');

module.exports = mongoose.model('user', bidsSchema);