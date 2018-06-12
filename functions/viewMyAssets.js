'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');

exports.viewMyAssets = (address) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside viewMyassets")
    var assetDetails = [];

    let AuctionResponse = await bcSdk.listAddressTransactions({
      address : address
      })

      .then((AuctionResponse) => {
        console.log(AuctionResponse)
        for (let i = 0; i < AuctionResponse.response.length; i++) {
        if(AuctionResponse.response[i].issue.addresses[0] == address && AuctionResponse.response[i].name !="Transaction Tokens") {

          assetDetails.push({
            "name":  AuctionResponse.response[i].issue.name,
            "issuersAddress": AuctionResponse.response[i].addresses[0],
            "assetref":  AuctionResponse.response[i].issue.assetref,
            "issuedqty":  AuctionResponse.response[i].issue.qty,
          })
        } else{
            console.log("no Assets found")
        }
        }

        return resolve({
          status: 200,
          query: assetDetails
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