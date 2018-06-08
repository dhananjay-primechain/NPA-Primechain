'use strict';

const bids = require('../models/bids');

exports.getClaimId = (assetName) => {
  return new Promise((resolve, reject) => {

      bids.find({
          "assetName": assetName
        })
        .then((res) => {
          console.log(res)

          return resolve({
            status: 201,
            claimId: res
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