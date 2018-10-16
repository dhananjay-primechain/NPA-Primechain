'use strict';

const bids = require('../models/bids');
const bcsdk = require('multichainsdk');

exports.rejectClaim = (key) => {
  return new Promise(async function (resolve, reject) {

    const bidStatus = await bids.findOneAndUpdate({
      "claimId": key
    }, {
        $set: {
          "status": "Rejected"
        }
      })
    let unlockTransaction = await bcsdk.lockUnspent({
      transactionId: bidStatus._doc.txid,
      vout: bidStatus._doc.vout
    })

      .then((unlockTransaction) => {
        return resolve({
          status: 201,
          query: unlockTransaction
        })
      })
  })

    .catch(err => {

      return reject({
        status: 401,
        message: err.message
      });
    })

};