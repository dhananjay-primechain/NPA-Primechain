'use strict';

const bids = require('../models/bids');
const bcsdk = require ('multichainsdk');

exports.rejectClaim = (key) => {
  return new Promise(async function(resolve, reject) {

    // let claimId_Details = await  bids.find({
    //       "claimId": key
    //     })
    
    const bidStatus = await bids.findOneAndUpdate({
      "claimId": key
    }, {
        $set: {
            "status": "Rejected"
        }
    })
    console.log("buds",bidStatus)
    let unlockTransaction = await bcsdk.lockUnspent({
      transactionId : bidStatus._doc.txid,
      vout:bidStatus._doc.vout
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