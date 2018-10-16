'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
var async = require('async');

exports.viewMyAssets = (address) => {
  return new Promise(async function (resolve, reject) {
    var assetDetails = [];

    let subscribeStream = await bcSdk.subscribe({
      // change before push "ENTITY_MASTERLIST_STREAM"
      stream: "ENTITY_MASTERLIST_STREAM"
    })

    let AuctionResponse = await bcSdk.listStreamKeyItemsStream({
      key: address,
      stream: "ENTITY_MASTERLIST_STREAM"
    })

      .then((AuctionResponse) => {
        async.forEach(AuctionResponse, (item, callback) => {
          let data_JSON = JSON.parse(item["data"])
          if (item["data"] != null && data_JSON.assetName != "Transaction Tokens") {
            assetDetails.push({
              "name": data_JSON.assetName,
              "issuersAddress": item.publishers,
              "assetHolder": item.assetHolder,
              "issuedqty": data_JSON.issuedQty,
              "assetRef": data_JSON.assetref
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
            query: assetDetails
          })
        })
      }).catch(err => {
        return reject({
          status: 401,
          message: err.message
        });
      })
  })
};