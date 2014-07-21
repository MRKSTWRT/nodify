var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var config = require('../config');

router.get('/', function(req, res) {
  var Shopify = new shopifyAPI({
    shop: req.session.shop,
    shopify_api_key: config.app.apiKey,
    shopify_shared_secret: config.app.sharedSecret,
    shopify_scope: config.app.scope,
    redirect_uri: config.app.url + '/finishauth',
    verbose: false
  });

  var authUrl = Shopify.buildAuthURL();
  res.redirect(authUrl);
});

module.exports = router;
