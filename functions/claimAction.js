'use strict';

const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');

exports.claimAction = (key ,fromAddress, assetName) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside claimAction asset")
    
    let tx_hex = await bcSdk.listStreamKeyItems({
      key : key,
      stream :"primechain",
      verbose : true

    })
    let decoderexchangeTX = await bcSdk.decodeRawExchange({
      hexstring: tx_hex.response[0].data
    })
        
    let secondunspent = await bcSdk.prepareLockUnspentFrom({
      from: fromAddress,
      assets: assetName
    })

    let appendRaw = await bcSdk.appendRawExchange({
      hexstring : tx_hex.response[0].data,
      txid   : secondunspent.response.txid,
      vout   : secondunspent.response.vout,
      assets : assetName
    })

    let completeTx = await bcSdk.sendRawTransaction({
      hexstring : appendRaw.response.hex
    })
    
      .then((completeTx) => {
        return resolve({
          status: 200,
          query: completeTx
        })
      })

      .catch(err => {

        if (err.code == 401) {
          return reject({
            status: 401,
            message: 'cant fetch !'
          });
        } else {
          console.log("error occurred" + JSON.stringify(err));
          return reject({
            status: 500,
            message: 'Internal Server Error !'
          });
        }
      })
  })
};