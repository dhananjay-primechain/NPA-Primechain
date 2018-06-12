'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');


exports.createBid = (fromAddress, toAddress, assetName, quantity) => {
  return new Promise(async function (resolve, reject) {
    console.log("inside create asset")
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
      stream: "ENTITY_MASTER_STREAM"
    })

    // let subscribeMAsterStream = await bcSdk.subscribe({
    //   stream: "ASSET_MASTERLIST_STREAM"
    // })

    // let formDetails = await bcSdk.publishFormData({
    //   formData: formData,
    //   key: key,
    //   address: toAddress,
    //   data_stream_name: "ENTITY_MASTER_STREAM",
    //   files = null,
    //   file_stream_name = "ASSET_MASTERLIST_STREAM"
    // })

    // let uploadDocs_Blockchain = await bcSdk.publishRawHex({
    //   key: assetName,
    //   value: hexfile,
    //   stream: "ASSET_MASTERLIST_STREAM"

    // })

    let assetRef = await bcSdk.listAssetsbyName({
      asset: assetName
    })

    let data = await {
      assetName: assetRef.response[0].name,
      amount: assetRef.response[0].issueqty,
      transactionId: assetRef.response[0].issuetxid,
      assetref: assetRef.response[0].assetref
    }

    let publishToBlockchain = await bcSdk.publish({
      key: toAddress,
      value: JSON.stringify(data),
      stream: "ENTITY_MASTER_STREAM"
    }).then((publishToBlockchain) => {
      console.log("blockchain params " + JSON.stringify(publishToBlockchain))

      return resolve({
        status: 200,
        query: publishToBlockchain
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