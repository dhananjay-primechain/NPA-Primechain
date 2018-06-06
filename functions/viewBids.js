'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');

exports.viewBids = (startCount,lastCount) => {
    return new Promise(async function(resolve, reject) {
        console.log("inside viewBids asset")
        var assetDetails = [];
        
        let AuctionResponse = await bcSdk.listAssets({
            start: startCount,
            count : lastCount
        })

        .then((res) => {
            console.log(res)
            for (let i=0; i<res.response.length; i++){
                assetDetails.push({
                    "name":res.response[i].name,
                    "issuers":res.response[i].issues[0].issuers[0],
                    "issuetxid":res.response[i].issuetxid,
                    "assetref":res.response[i].assetref,
                    "issuedqty":res.response[i].issueqty,
                    "units":res.response[i].units,
                    "subscribed":res.response[i].subscribed
                })
            }
            
            return resolve({
                status: 200,
                query: assetDetails
            })
        })

        .catch(err => {

            if (err.code == 401) {

                return reject({
                    status: 401,
                    message: 'cant fetch !'
                });

            } else {
                console.log("error occurred" + err);

                return reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            }
        })
    })
};