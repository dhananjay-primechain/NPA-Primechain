'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');


exports.viewClaims = (assetName) => {
  return new Promise(async function (resolve, reject) {
    var assetDetails = [];
    let AuctionResponse = await bcSdk.listAssetsbyName({
      asset: assetName
    })

      .then((res) => {

        for (let i = 0; i < res.response.length; i++) {
          assetDetails.push({
            "name": res.response[i].name,
            "issuers": res.response[i].issues[0].issuers[0],
            "issuetxid": res.response[i].issuetxid,
            "assetref": res.response[i].assetref,
            "issueqty": res.response[i].issueqty,
            "units": res.response[i].units,
            "subscribed": res.response[i].subscribed
          })
        }

        return resolve({
          status: 200,
          query: assetDetails
        })
      })

      .catch(err => {
        return reject({
          status: 401,
          message: err.message
        });
      })
  })
};