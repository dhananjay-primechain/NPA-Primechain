'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');


exports.claimAction = (assetName) => {
  return new Promise(async function(resolve, reject) {
    console.log("inside claimAction asset")
    var assetDetails = [];

    let lockunspentassets = await bcSdk.prepareLockUnspent({assets : assetName})

    let rawexchange =  await bcSdk.createRawExchange({
      txid : lockunspentassets.response.txid,
      vout : lockunspentassets.response.vout,
      assets : assetName
    })

    let decoderexchangeTX = await bcSdk.decodeRawExchange({
      hexstring : rawexchange.response
    })


    let rawExchnge = await bcSdk.completeRawExchange({
      hexstring : rawexchange.response,
      txid : lockunspentassets.response.txid,
      vout : lockunspentassets.response.vout,
      assets : assetName,
      data : "Transaction Completed"

    })

      .then((rawExchnge) => {
        console.log(rawExchnge)
        // for (let i = 0; i < res.length; i++) {
        //   assetDetails.push({

        //   })
        // }
        return resolve({
          status: 200,
          query: rawExchnge
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