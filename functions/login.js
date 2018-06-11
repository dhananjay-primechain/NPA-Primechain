'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const user = require('../models/users');

exports.login = (emailId) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside login function")

    let newUser = await user.find({
      "emailId": emailId
    })
    //  exception Handling
    if (newUser.length == 0) {

      let newAddress = await bcSdk.getNewAddress()

      let grantPermission = await bcSdk.grant({
        "addresses": newAddress.response[0].address,
        "permissions": "connect,send,receive"
      })

      const login = await new user({
        emailId: emailId,
        address: newAddress.response[0].address,
      });
      login.save()

      let grantWritePermission = await bcSdk.grant({
          "addresses": newAddress.response[0].address,
          "permissions": "NPA_CLAIM_STREAM.write"
        })

        .then((newAddress) => {
          console.log("blockchain params " + JSON.stringify(newAddress))

          return resolve({
            status: 200,
            query: newAddress.response[0].address
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

    } else {
      return resolve({
        status: 200,
        query: newUser[0].address
      })
    }
    console.log("Login Function")
  })
};