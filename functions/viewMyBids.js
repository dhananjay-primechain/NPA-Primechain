'use strict';

const bids = require('../models/bids');
const bcsdk = require ('multichainsdk');

exports.viewMyBids = (emailId) => {
  return new Promise(async function(resolve, reject) {
    var bidsDetails =[];
    let claim_Details = await  bids.find({
          "emailId": emailId
    })

    .then((claim_Details) => {
          console.log(claim_Details)
          for (let i=0; i<claim_Details.length; i++){

            bidsDetails.push({
              "emailId":claim_Details[i].emailId,
              "claimId":claim_Details[i].claimId,
              "assetPurchase":claim_Details[i].offerAsset,
              "bidAmount": claim_Details[i].bidAmount,
              "assetOffered":claim_Details[i].offerAsset,
              "offerAmount" : claim_Details[i].offerAmount,
              "status":claim_Details[i].status
            })
          }
          return resolve({
            status: 201,
            query: bidsDetails
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