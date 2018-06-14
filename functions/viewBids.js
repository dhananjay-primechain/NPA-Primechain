'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
var async = require('async');
exports.viewBids = () => {
  return new Promise(async function(resolve, reject) {
    console.log("inside viewBids asset")
    var assetDetails = [];

    let AuctionResponse = await bcSdk.listAssets({})

      .then((AuctionResponse) => {
        console.log(AuctionResponse)
        var bidsList = AuctionResponse.response;
        console.log(bidsList)
        async.forEach(bidsList, (item, callback) => {
          if (item.name != "Transaction Tokens") {
            assetDetails.push({
              "name": item.name,
              "issuers": item.issues[0].issuers[0],
              "issuetxid": item.issuetxid,
              "assetref": item.assetref,
              "issuedqty": item.issueqty,
              "units": item.units,
              "subscribed": item.subscribed
            })
            callback();
          } else {
            callback();
          }

        }, (err) => {
          if (err) {
            return resolve({
              status: 404,
              query: "data is not found"
            })
          }

          return resolve({
            status: 200,
            query: assetDetails,
          })
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