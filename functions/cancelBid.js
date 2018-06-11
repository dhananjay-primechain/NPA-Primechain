'use strict';

const bids = require('../models/bids');
const bcsdk = require ('multichainsdk');

exports.cancelBid = (claimId) => {
  return new Promise(async function(resolve, reject) {

    let claimId_Details = await  bids.find({
        "claimId": claimId
      })
  
    const bidStatus = await bids.findOneAndUpdate({
      "claimId": claimId
    }, {
        $set: {
            "status": "cancelled"
        }
    })

    let unlockTransaction = await bcsdk.lockUnspent({
      transactionId : claimId_Details[0]._doc.txid,
      vout:claimId_Details[0]._doc.vout
    })

    .then((unlockTransaction) => {
          console.log(unlockTransaction)

          return resolve({
            status: 201,
            query: unlockTransaction
          })
        })
    })

    .catch(err => {

      console.log("error occurred" + err);

      return reject({
        status: 500,
        message: 'Internal Server Error !'
      });
    })

};