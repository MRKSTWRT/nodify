var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var config = require('../config.js');
var md5 = require('MD5');

router.get('/', function(req, res, next) {
  var shopify = new shopifyAPI({
    shop: req.session.shop,
    shopify_api_key: config.app.apiKey,
    shopify_shared_secret: config.app.sharedSecret,
    access_token: req.session.token,
    verbose: false
  });

  shopify.get('/admin/products/count.json', function(e, d, h) {
    res.render('index', {config: config, shop: req.session.shop, data: d});
  });
});

router.get('/test', function(req, res, next) {
  res.render('noentry');
});

module.exports = router;
