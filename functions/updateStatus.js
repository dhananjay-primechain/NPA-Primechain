'use strict';

const bids = require('../models/bids');

exports.updateStatus = (key) => {
  return new Promise(async function (resolve, reject) {

    const bidStatus = await bids.findOneAndUpdate({
      "claimId": key
    }, {
        $set: {
          "status": "Accepted"
        }
      })

      .then((bidStatus) => {

        return resolve({
          status: 201,
          query: "Bid Successful ....!"
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