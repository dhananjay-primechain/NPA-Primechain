'use strict';

const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const mongoose = require('mongoose');

exports.claimAction = (key, fromAddress, assetName, offerAssetName) => {
  return new Promise(async function (resolve, reject) {

    let tx_hex = await bcSdk.listStreamKeyItems({
      key: key,
      stream: "NPA_CLAIM_STREAM",
      verbose: true

    })
    let decoderexchangeTX = await bcSdk.decodeRawExchange({
      hexstring: tx_hex.response[0].data
    })

    let secondunspent = await bcSdk.prepareLockUnspentFrom({
      from: fromAddress,
      assets: offerAssetName
    })

    let appendRaw = await bcSdk.appendRawExchange({
      hexstring: tx_hex.response[0].data,
      txid: secondunspent.response.txid,
      vout: secondunspent.response.vout,
      assets: assetName
    })

    const bidStatus = await bids.findOneAndUpdate({
      "claimId": key
    }, {
        $set: {
          "status": "Approved"
        }
      })
    let completeTx = await bcSdk.sendRawTransaction({
      hexstring: appendRaw.response.hex
    })

      .then((completeTx) => {
        return resolve({
          status: 200,
          query: completeTx
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