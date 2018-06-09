'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const uuidv4 = require('uuid/v4');
const bids = require ('../models/bids');

exports.placeBid = (fromAddress, assetName, offerAsset) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside create asset")

    var assetKey = Object.keys(assetName)
    var asset_Ref = assetKey[0]
    
    let lockunspentassets = await bcSdk.prepareLockUnspentFrom({
      from: fromAddress,
      assets: assetName
    })
    
    let rawexchange = await bcSdk.createRawExchange({
      txid : lockunspentassets.response.txid,
      vout : lockunspentassets.response.vout,
      assets : offerAsset
    })
    // data need to store into mongo
    var claimId = await uuidv4();

    const placeBid = await new bids({
    claimId : claimId,
    assetName : assetName,
    offerAsset : offerAsset,
    txid : lockunspentassets.response.txid,
    vout : lockunspentassets.response.vout,
    });
    placeBid.save() 
    
    console.log("claimId",claimId)
    // before storing data into blockchain  store claimId , assetName and assetsRef in mongo.

    let upload_toBlockchain = await bcSdk.publishRawHex({
      key : claimId,
      value : rawexchange.response,
      stream :"primechain"
    })

    .then((upload_toBlockchain) => {
        console.log("blockchain params " + JSON.stringify(upload_toBlockchain))

        return resolve({
          status: 200,
          query: upload_toBlockchain
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