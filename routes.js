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
const getClaimId = require ('./functions/getClaimId');
const rejectclaim = require('./functions/rejectClaim');
module.exports = router => {

  // api/v-1.0/createAssets will create assets and autosubscribe it.
  router.post('/api/v-1.0/createAssets', (req, res) => {
    
    var fromAddress = req.body.fromAddress;
    var toAddress = req.body.toAddress;
    var assetName = req.body.assetName;
    var quantity = req.body.quantity;
    var amount = req.body.amount;
    // exception logic to check any parameter is missing.
    if (!assetName || !fromAddress || !key) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {
    createBid.createBid(fromAddress, toAddress, assetName, quantity, amount)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));
    }
  })

  // api/v-1.0/viewAllAssets will return all assets present multichain node.
  router.get("/api/v-1.0/viewAllAssets", (req, res) => {

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

// api/v-1.0/searchAssetsByName works as search assets by its name.
  router.post('/api/v-1.0/searchAssetsByName', (req, res) => {

    var assetName = req.body.assetName;
    if (!assetName || !assetName) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {
    viewClaims.viewClaims(assetName)

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
  
//  api/v-1.0/viewMyAssets returns all the asset for the owner who created that asset.
  router.get('/api/v-1.0/viewMyAssets', (req, res) => {
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

  // api/v-1.0/approveClaim will accept the bid an complete the transaction. 
  router.post('/api/v-1.0/approveClaim', (req, res) => {
    
    var key = req.body.claimId;
    var fromAddress = req.body.from;
    var assetName = req.body.assets;
    
    // exception logic to check any parameter is missing.

    if (!assetName || !fromAddress || !key) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

    claimAction.claimAction(key ,fromAddress, assetName)

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
  
  // api/v-1.0/rejectClaim will unlock the assets and return the amount which is held during bid process.
  router.post('/api/v-1.0/rejectClaim', (req, res) => {
    
    var key = req.body.claimId;
    
    // exception logic to check any parameter is missing.

    if (!key || !key) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {
      
      rejectclaim.rejectClaim(key)

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

  router.post('/api/v-1.0/claimBid', (req, res) => {

    var fromAddress = req.body.from;
    
    var assetName = req.body.assets;
   
    var offerAsset =req.body.offer_assets;

    // exception logic to check any parameter is missing.

    if (!assetName || !fromAddress || !offerAsset) {
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


  router.get('/api/v-1.0/cancelBid', (req, res) => {

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

  router.get('/api/v-1.0/viewClaims',(req,res)=>{

    if (1 == 1) {

      const requestid1 = checkToken(req);
      const assetName = requestid1;
  
      getClaimId.getClaimId(assetName)
  
        .then(result => {
          res.status(result.status).json({
            message: result.claimId
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
  })

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