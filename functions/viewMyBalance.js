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
    // let getAddress = await  user.find({
    //       "emailId": emailId
    //     })
    // console.log("getAddress",getAddress)
    let getBalance = await bcSdk.getAddressBalances({
      "address": address

    }).then((getBalance) => {
      console.log("inside Then",getBalance)
      var getBalances = {};
      var address_balances = getBalance.response;
      async.forEach(address_balances, (item, callback) => {
        console.log(item);
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
        return resolve({
          status: 200,
          query: getBalances
        })
      });

      console.log("blockchain params " + JSON.stringify(getBalance))

      return resolve({
        status: 200,
        query: getBalance
      })
    }).catch(err => {

      if (err.code == 401) {

        return reject({
          status: 401,
          message: 'cant fetch !'
        });

      } else {
        console.log("error occurred" + err);

        return reject({
          status: 500,
          message: 'Internal Server Error !'
        });
      }
    })
  })

};