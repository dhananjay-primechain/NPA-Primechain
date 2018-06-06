/**
@author: dhananjay patil
@version: 1.0
@date: 02/06/2017
@Description: Multichain Sdk
**/
//this is the start of the application 
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
var Promise = require('bluebird');


module.exports = router;

app.use(bodyParser.json());


const port = process.env.PORT || 3000;
app.listen(port);

app.use(bodyParser.json());

require('./routes')(router);
app.use('/', router);

app.use(bodyParser.urlencoded({
  extended: true
}));
console.log(`App Runs on ${port}`);