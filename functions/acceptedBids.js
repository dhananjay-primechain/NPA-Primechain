'use strict';

const bids = require('../models/bids');
const bcSdk = require('multichainsdk');

exports.acceptedBids = (assetName) => {
    return new Promise(async function (resolve, reject) {
        var assetDetails = [];

        let myData = await bids.find({ "offerAsset": assetName })
                
            .then((myData) => {

                for(let i = 0; i<myData.length; i++){
                    if(myData[i]._doc.status == "Accepted"){
                        assetDetails.push({
                            "AssetName":myData[i]._doc.assetName,
                            "User":myData[i]._doc.emailId,
                            "claimId":myData[i]._doc.claimId,
                            "assetName" :myData[i]._doc.assetName,
                            "offerAsset":myData[i]._doc.offerAsset,
                            "bidAmount":myData[i]._doc.bidAmount,
                            "offerAmount":myData[i]._doc.offerAmount,
                            "txid":myData[i]._doc.txid,
                            "status":myData[i]._doc.status
                        })
                    }
                }
                return resolve({
                    status: 201,
                    query: assetDetails
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