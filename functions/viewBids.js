'use strict';

const balance = require('../models/balance');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcSdk = require('multichainsdk');
var async = require('async');

exports.viewBids = () => {
    return new Promise(async function (resolve, reject) {
        var assetDetails = [];


        let getAllAssets = await bcSdk.listStreamItems({
            stream: "ASSET_DETAILS_STREAM"
        })

            .then((getAllAssets) => {
                console.log(getAllAssets)
                async.forEach(getAllAssets.response, (item, callback) => {
                    var dataJson = JSON.parse(item.data)
                    bcSdk.importAddress({
                        address: dataJson.toAddress
                    })
                    bcSdk.getAddressBalances({
                        address: dataJson.toAddress
                    }).then((res) => {
                        var allAssets = res.response;
                        allAssets.forEach(element => {
                            if (dataJson.assetName == element.name) {
                                assetDetails.push({
                                    fromAddress: dataJson.fromAddress,
                                    toAddress: dataJson.toAddress,
                                    assetName: dataJson.assetName,
                                    assetHolder: dataJson.assetHolder,
                                    issuedQty: dataJson.issuedQty,
                                    transactionId: dataJson.transactionId,
                                    assetref: dataJson.assetref,
                                    availableQty: element.qty,
                                    document_hash: dataJson.document_hash,
                                    document_txid: dataJson.document_txid
                                })
                            }
                            
                        });
                        callback();

                    });

                }, (err) => {
                    if (err) {
                        return resolve({
                            status: 404,
                            claimId: "data not found"
                        })
                    }

                    return resolve({
                        status: 200,
                        claimId: assetDetails,
                    })
                })
             
                console.log(assetDetails)

                // return resolve({
                //   status: 201,
                //   claimId: claimIds
                // })
            })
        
            .catch(err => {

                console.log("error occurred" + err);

                return reject({
                    status: 500,
                    claimId: 'Internal Server Error !'
                });
            })
        })
    };