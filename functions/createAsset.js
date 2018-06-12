'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');


exports.createBid = (fromAddress, toAddress, assetName, quantity ) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside create asset")
    // issues an asset to addressses with its quantity and units.
    let issue = await bcSdk.issueFrom({
      from: fromAddress,
      to: toAddress,
      asset: assetName,
      qty: quantity
    })
    // let uploadDocs_Blockchain = await bcSdk.publishRawHex({
    //     key : assetName,
    //     value : hexfile,
    //     stream : "primeChain"

    // })

    // after assets created it will subscribe to that assets.
    let subscribeAsset = await bcSdk.subscribe({
        stream: assetName
    })

    let assetRef = await bcSdk.listAssetsbyName({
      asset : assetName
    })

      .then((assetRef) => {
        console.log("blockchain params " + JSON.stringify(assetRef))

        return resolve({
          status: 200,
          query: assetRef
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