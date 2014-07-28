var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var config = require('../config');

router.get('/', function(req, res) {
  var shopify = new shopifyAPI({
    shop: req.session.shop,
    shopify_api_key: config.app.apiKey,
    shopify_shared_secret: config.app.sharedSecret,
    shopify_scope: config.app.scope,
    redirect_uri: config.app.url + '/finishauth',
    verbose: false
  });

  shopify.exchange_temporary_token(req.query, function(error, data) {

    if (!error) {
      req.session.token = data['access_token'];
      req.knex.select('*')
      .from('shops')
      .where('token', '=', req.session.token)
      .exec(function(error, rows) {
        if (!error) {
          if(!rows[0]) {
            req.knex.insert({shop: req.session.shop, token: req.session.token})
            .into('shops')
            .exec(function(error, rows) {
              if (!error) {
                var postData = {
                  "webhook": {
                    "topic": "app/uninstalled",
                    "address": config.app.url + "/uninstall",
                    "format": "json"
                  }
                };
                shopify.post('/admin/webhooks.json', postData, function(error, data, headers) {
                  res.redirect('/render');
                });
              }
            });
          } else {
            req.session.shopId = rows[0].id;
            res.redirect('/render');
          }
        } else {
          console.log(error);
        }
      });
    }
  });
});

module.exports = router;
