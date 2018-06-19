'use strict';
var express = require('express');
var router = express.Router();
var cors = require('cors');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// functions path
const createBid = require('./functions/createAsset')
const claimAction = require('./functions/claimAction');
const viewBids = require('./functions/viewBids');
const viewClaims = require('./functions/viewClaims');
const placeBid = require('./functions/placeBid');
const viewMyAssets = require('./functions/viewMyAssets');
const getClaimId = require('./functions/getClaimId');
const rejectclaim = require('./functions/rejectClaim');
const viewMyBids = require('./functions/viewMyBids');
const login = require('./functions/login');
const cancelBid = require('./functions/cancelBid');
const viewMyBalance = require('./functions/viewMyBalance');
const updateStatus = require('./functions/updateStatus');
const acceptedBids = require ('./functions/acceptedBids');
const rejectedBids = require ('./functions/rejectedBids');
// endpoints will be exposed to all web application
module.exports = router => {

  // api/v-1.0/login

  router.post('/api/v-1.0/login', (req, res) => {
    var emailId = req.body.email;

    if (!emailId) {
      res.status(400).json({
        message: 'Invalid Request'
      })
    } else {
      login.login(emailId)
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

  // api/v-1.0/createAssets will create assets and autosubscribe it.
  router.post('/api/v-1.0/createAssets', multipartMiddleware,(req, res) => {

    var fromAddress = "1JbSWztGVtrFRReUBhatBidNbsZ4DsaFWYuFEE";
    var toAddress = "4QhTfQnQJkHUjuxGxMi8iR6BHMEFVDvjfowiQo";
    var assetName = "JEEP";
    var quantity = 1000;
    var assetHolder = "DJ";
    // var amount = req.body.amount;
    var file = req.files.file;
    // exception logic to check any parameter is missing.
    if (!assetName || !fromAddress || !toAddress || !quantity || !assetHolder || !file) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {
      createBid.createBid(fromAddress, toAddress, assetName, assetHolder, quantity , file)

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
        .then(function (result) {
          return res.status(200).json({
            "data": result.claimId,
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
      if (!address) {
        res.status(400).json({
          message: 'Invalid Request'
        });
      }

      viewMyAssets.viewMyAssets(address)

        .then(result => {
          res.status(result.status).json({
            message: result.query
          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    } else {
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
    var offerAssetName = req.body.offerAsset;

    // exception logic to check any parameter is missing.

    if (!assetName || !fromAddress || !offerAssetName || !key) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      claimAction.claimAction(key, fromAddress, assetName, offerAssetName)

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

  // /api/v-1.0/claimBid for customer to bid for an asset 
  router.post('/api/v-1.0/claimBid', (req, res) => {

    var emailId = req.body.email;

    var assetName = req.body.assets;

    var offerAsset = req.body.offer_assets;

    // exception logic to check any parameter is missing.

    if (!assetName || !emailId || !offerAsset) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      placeBid.placeBid(emailId, assetName, offerAsset)

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

  // api/v-1.0/cancelBid for customer to cancel bid
  router.get('/api/v-1.0/cancelBid', (req, res) => {

    if (1 == 1) {

      const requestid1 = checkToken(req);
      const claimId = requestid1;

      cancelBid.cancelBid(claimId)

        .then(result => {
          res.status(result.status).json({
            message: result.query
          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    } else {
      res.status(401).json({
        message: 'Assets are not yet created !'
      });

    }
  });

  router.get('/api/v-1.0/viewClaims', (req, res) => {

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
    } else {
      res.status(401).json({
        message: 'Assets are not yet created !'
      });

    }
  })

  router.get('/api/v-1.0/viewMyBids', (req, res) => {

    if (1 == 1) {

      const requestid1 = checkToken(req);
      const emailId = requestid1;

      viewMyBids.viewMyBids(emailId)

        .then(result => {
          res.status(result.status).json({
            message: result.query
          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    } else {
      res.status(401).json({
        message: 'Assets are not yet created !'
      });

    }
  })

  router.get('/api/v-1.0/viewMyBalance', (req, res) => {

    if (1 == 1) {

      const requestid1 = checkToken(req);
      const address = requestid1;
      console.log(address)
      viewMyBalance.viewMyBalance(address)

        .then(result => {
          res.status(result.status).json({
            message: result.query
          })
        })

        .catch(err => res.status(err.status).json({
          message: err.message
        }));
    } else {
      res.status(401).json({
        message: 'Assets are not yet created !'
      });

    }
  })

  router.post('/api/v-1.0/updateStatus', (req, res) => {

    var key = req.body.claimId;

    if (!key) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      updateStatus.updateStatus(key)

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

  router.post('/api/v-1.0/viewAcceptedBids',(req,res)=>{

    var assetName = req.body.assetName;
    if (!assetName) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      acceptedBids.acceptedBids(assetName)

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

  router.post('/api/v-1.0/viewRejectedBids',(req,res)=>{

    var assetName = req.body.assetName;
    if (!assetName) {
      res.status(400).json({
        message: 'Invalid Request'
      });
    } else {

      rejectedBids.rejectedBids(assetName)

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
  function checkToken(req) {

    const token = req.headers['authorization'];

    if (token) {

      try {
        (token.length != 0)
        return token
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }
}