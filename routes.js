'use strict';
var express = require('express');
var router = express.Router();
var cors = require('cors');
var multichain = require('multichainsdk')
const createBid = require('./functions/createAsset')
const claimAction = require('./functions/claimAction');
const viewBids = require('./functions/viewBids');
const viewClaims = require('./functions/viewClaims');
module.exports = router => {

  router.post('/createBid', (req, res) => {

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


  router.get("/viewBids", (req, res) => {

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

  router.post('/viewbidsByName', (req, res) => {

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

  router.post('/ClaimAction', (req, res) => {

    var assetName = req.body.assets;
  
    console.log("assetname", assetName)

    claimAction.claimAction(assetName)

      .then(result => {
        res.status(result.status).json({
          message: result.query
        })
      })

      .catch(err => res.status(err.status).json({
        message: err.message
      }));
  });

  // router.post('/ClaimAction', (req, res) => {
  //   multichain.listStreamKeyItems({"stream":"", "key":claimID, "verbose":true, "count":1, "start":-1}, (err, claimTxDataItem){
  //     var exchangeHex = claimTxDataItem.data;
  //     multichain.decodeRawExchange({},(err, decodedExchange)=>{
  //       currency = decodedExchange.offer;
  //       npaAsset = decodedExchange.ask;
  //       var lockedNpaAsset = {};
  //       lockedNpaAsset[npaAsset.name] = npaAsset.qty;
  //       multichain.prepareLockUnspentFrom({"", "assets":lockedNpaAsset, lock:true}, (err, lockedTx)=>{
  //       });
  //     })
  //   });
  // });


  router.get('/viewAllOffers', (req, res) => {

    if (1 == 1) {

      multichain.listAssets()
        .then(function(result) {
          console.log(result.response[0].issues[0].issuers)
          return res.json({
            "status": 200,
            "issuers": (result.response[0].issues[0].issuers),
            "data": result
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


  router.post('/placeBid', (req, res) => {

    var addresses = req.body.addresses;
    console.log("address", addresses);
    // 122vNyAJJE8hPLVgYTFKpuTiKVLGnKFtuLaWsm
    var permissions = req.body.permissions;
    console.log("permission", permissions)
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


  router.get('/cancelBid', (req, res) => {

    var addresses = req.body.addresses;
    console.log("address", addresses);
    // 122vNyAJJE8hPLVgYTFKpuTiKVLGnKFtuLaWsm
    var permissions = req.body.permissions;
    console.log("permission", permissions)
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

}