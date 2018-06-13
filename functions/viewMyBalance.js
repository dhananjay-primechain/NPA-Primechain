'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk')
const user = require('../models/users');

exports.viewMyBalance = () => {
  return new Promise(async function (resolve, reject)  {

    // let getAddress = await  user.find({
    //       "emailId": emailId
    //     })
    let getBalance =  await bcSdk.getTotalBalances({
          //  "address": getAddress[0].address

    })
       
      .then((getBalance) => {
        console.log("blockchain params " + JSON.stringify(getBalance))

        return resolve({
          status: 200,
          query: getBalance
        })
      })

      .catch(err => {

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