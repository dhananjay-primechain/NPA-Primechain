'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const uuidv4 = require('uuid/v4');
const bids = require('../models/bids');
const user = require('../models/users');

exports.placeBid = (emailId, assetHolder, assetName, offerAsset) => {
  return new Promise(async function (resolve, reject) {

    var assetKey = Object.keys(assetName)
    var asset_Ref = assetKey[0]

    var off_ref = Object.keys(offerAsset)
    var offer_Asset = off_ref[0]

    var assetAmount = Object.values(assetName)
    var bidAmount = assetAmount[0]
    console.log(bidAmount)

    var offerAssetAmount = Object.values(offerAsset)
    var offerAmount = offerAssetAmount[0]

    let subscribeAsset = await bcSdk.subscribe({
      stream: asset_Ref
    })

    let subscribeOfferAsset = await bcSdk.subscribe({
      stream: offer_Asset
    })

    let getAddress = await user.findOne({
      "emailId": emailId
    })

    let importAddress = await bcSdk.importAddress({
      address: getAddress.address
    })

    let lockunspentassets = await bcSdk.prepareLockUnspentFrom({
      from: getAddress.address,
      assets: assetName
    })

    let rawexchange = await bcSdk.createRawExchange({
      txid: lockunspentassets.response.txid,
      vout: lockunspentassets.response.vout,
      assets: offerAsset
    })
    // data need to store into mongo
    var claimId = await uuidv4();

    const placeBid = await new bids({
      emailId: getAddress.emailId,
      address: getAddress.address,
      assetHolder: assetHolder,
      claimId: claimId,
      assetName: asset_Ref,
      offerAsset: offer_Asset,
      bidAmount: bidAmount,
      offerAmount: offerAmount,
      txid: lockunspentassets.response.txid,
      vout: lockunspentassets.response.vout,
      status: "pending"
    })
    placeBid.save()

    // before storing data into blockchain  store claimId , assetName and assetsRef in mongo.

    let upload_toBlockchain = await bcSdk.publishRawHex({
      key: claimId,
      value: rawexchange.response,
      stream: "NPA_CLAIM_STREAM"
    })

      .then((upload_toBlockchain) => {

        return resolve({
          status: 200,
          query: upload_toBlockchain
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