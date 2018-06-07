'use strict';
var express = require('express');
var router = express.Router();
var cors = require('cors');
var multichain = require('multichainsdk')
const createBid = require('./functions/createAsset')
const claimAction = require('./functions/claimAction');
const viewBids = require('./functions/viewBids');
const viewClaims = require('./functions/viewClaims');
const placeBid = require ('./functions/placeBid');
const viewMyAssets = require ('./functions/viewMyAssets');
module.exports = router => {

  router.post('/npa/api/v-1.0/createAssets', (req, res) => {

    var fromAddress = req.body.fromAddress;
    var toAddress = req.body.toAddress;
    var assetName = req.body.assetName;
    var quantity = req.body.quantity;
    var amount = req.body.amount;

    createBid.createBid(fromAddress, toAddress, assetName, quantity, amount)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));
  })


  router.get("/npa/api/v-1.0/viewAllAssets", (req, res) => {

    if (1 == 1) {

      viewBids.viewBids()
        .then(function(result) {
          return res.status(200).json({
            "data": result.query
          });
        })
        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    } else {
      res.status(401).json({
        "status": false,
        message: 'cant fetch data !'
      });
    }
  });

  router.post('/npa/api/v-1.0/searchAssetsByName', (req, res) => {

    var assetName = req.body.assetName;

    viewClaims.viewClaims(assetName)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));

  });

  router.get('/npa/api/v-1.0/viewMyAssets', (req, res) => {
    if (1 == 1) {

    const requestid1 = checkToken(req);
    const address = requestid1;

    viewMyAssets.viewMyAssets(address)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));
    }else{
      res.status(401).json({
        message: 'Assets are not yet created !'
      });

    }
  });


  router.post('/npa/api/v-1.0/assetAction', (req, res) => {
    var key = req.body.claimId;
    var fromAddress = req.body.from;
    var assetName = req.body.assets;

    console.log("assetname", assetName)

    claimAction.claimAction(key ,fromAddress, assetName)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));
  });

  router.post('/npa/api/v-1.0/claimBid', (req, res) => {

    var fromAddress = req.body.from;
    console.log("address", fromAddress);
    
    var assetName = req.body.assets;
    console.log(assetName)
   
    var offerAsset =req.body.offer_assets;

    if (!assetName || !assetName) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      placeBid.placeBid(fromAddress,assetName,offerAsset)

        .then(result => {
          res.status(result.status).json({
            message: result.query

          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    }
  });


  router.get('/npa/api/v-1.0/cancelBid', (req, res) => {


    if (!permissions || !permissions) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      blockchainparams.getBlockChainParams(addresses, permissions)

        .then(result => {
          res.status(result.status).json({
            message: result.query

          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    }
  });
  
  function checkToken(req) {

    const token = req.headers['authorization'];

    if (token) {

        try {
             (token.length!=0)
             return token
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}
}