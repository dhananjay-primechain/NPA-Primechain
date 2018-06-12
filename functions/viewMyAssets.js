'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
var async = require('async');

exports.viewMyAssets = (address) => {
  return new Promise(async function (resolve, reject) {
    console.log("inside viewMyassets")
    var assetDetails = [];

    let AuctionResponse = await bcSdk.listStreamKeyItemsStream({
      key: address,
      stream: "ENTITY_MASTER_STREAM"
    })
    
      .then((AuctionResponse) => {
        async.forEach(AuctionResponse, (item, callback) => {
          let data_JSON = JSON.parse(item["data"])
          if (item["data"] != null && data_JSON.assetName !="Transaction Tokens") {
            assetDetails.push({
              "name": data_JSON.assetName,
              "issuersAddress": item.publishers,
              "issuedqty": data_JSON.amount,
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

        // for (let i = 0; i <= AuctionResponse.length; i++) {
        //   let data_JSON = JSON.parse(AuctionResponse[i]);
        //   console.log(data_JSON)
        //   if (AuctionResponse[i].key == address) {
        //     assetDetails.push({
        //       "name": data_JSON.assetName,
        //       "issuersAddress": data_JSON.publishers,
        //       "issuedqty": data_JSON.amount,
        //       "assetRef": data_JSON.assetref
        //     })
        //     console.log("data in array------>",assetDetails)
        //   } else {
        //     console.log("no Assets found")
        //   }
        // }

        // return resolve({
        //   status: 200,
        //   query: assetDetails
        // })
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