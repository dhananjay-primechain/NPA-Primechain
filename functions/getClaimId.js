'use strict';

const bids = require('../models/bids');

exports.getClaimId = (assetName) => {
  return new Promise((resolve, reject) => {
    var claimIds = [];
    bids.find({
      "offerAsset": assetName
    })

      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].status != "cancelled" && res[i].status !="Accepted" && res[i].status !="Rejected") {
            claimIds.push({
              emailId: res[i].emailId,
              address: res[i].address,
              claimId: res[i].claimId,
              assetName: res[i].assetName,
              offerAsset: res[i].offerAsset,
              bidAmount: res[i].bidAmount,
              offerAmount: res[i].offerAmount,
              txid: res[i].txid,
              vout: res[i].vout,
              status: res[i].status
            })

          } else {
            console.log("NO bids")
          }
          console.log(claimIds)
        }
        return resolve({
          status: 201,
          claimId: claimIds
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