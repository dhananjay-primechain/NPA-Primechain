'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const crypto = require("crypto");

exports.createBid = (fromAddress, toAddress, assetName, assetHolder, quantity, file) => {
  return new Promise(async function (resolve, reject) {

    // issues an asset to addressses with its quantity and units.
    let issue = await bcSdk.issueFrom({
      from: fromAddress,
      to: toAddress,
      asset: assetName,
      qty: quantity
    })
    // after assets created it will subscribe to that assets.
    let subscribeAsset = await bcSdk.subscribe({
      stream: assetName
    })

    let subscribeStream = await bcSdk.subscribe({
      // change before push "ENTITY_MASTERLIST_STREAM"
      stream: "ASSET_DETAILS_STREAM"
    })

    let subscribeMAsterStream = await bcSdk.subscribe({
      stream: "ASSET_MASTERLIST_STREAM"
    })

    let fileInfo = await {
      name: file.name,
      mimetype: file.type,
      data: Buffer.from(file.path).toString('hex')
    }
    let fileKey = await crypto.createHash('sha256').update(file.path).digest('hex')
    let formDetails = await bcSdk.publish({
      stream: "ASSET_MASTERLIST_STREAM",
      key: fileKey,
      value: JSON.stringify(fileInfo)
    })

    let assetRef = await bcSdk.listAssetsbyName({
      asset: assetName
    })

    let data = await {
      fromAddress: fromAddress,
      toAddress: toAddress,
      assetName: assetRef.response[0].name,
      assetHolder: assetHolder,
      issuedQty: assetRef.response[0].issueqty,
      transactionId: assetRef.response[0].issuetxid,
      assetref: assetRef.response[0].assetref,
      document_hash: fileKey,
      document_txid: formDetails.response
    }

    let publishToBlockchain = await bcSdk.publish({
      key: toAddress,
      value: JSON.stringify(data),
      stream: "ASSET_DETAILS_STREAM"
    }).then((publishToBlockchain) => {

      return resolve({
        status: 200,
        query: publishToBlockchain
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