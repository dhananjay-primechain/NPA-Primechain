'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk')
const user = require('../models/users');
const async = require('async');
exports.viewMyBalance = (address) => {
  return new Promise(async function (resolve, reject) {
    var tokenBalance = [];

    let getBalance = await bcSdk.getAddressBalances({
      "address": address

    }).then((getBalance) => {
      var getBalances = {};
      var address_balances = getBalance.response;
      async.forEach(address_balances, (item, callback) => {
        if (item && item["name"] === "Transaction Tokens") {
          getBalances["name"] = item["name"];
          getBalances["quantity"] = item["qty"];
          callback();
        }
        else {

          callback();
        }
      }, (err) => {
        if (err) {
          return reject({
            status: 401,
            message: 'cant fetch !'
          });
        }
        if (Object.keys(getBalances).length > 0) {
          return resolve({
            status: 200,
            query: getBalances
          })
        } else {
          let zeroQuantity = {
            name: "eg",
            quantity: "0"
          };

          return resolve({
            status: 200,
            query: zeroQuantity
          })
        }
      });
      return resolve({
        status: 200,
        query: getBalance
      })
    }).catch(err => {
      return reject({
        status: 401,
        message: err.message
      });
    })
  })

};