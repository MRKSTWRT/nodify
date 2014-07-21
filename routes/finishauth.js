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

      req.db.query('SELECT * FROM shops WHERE token = "' + req.session.token + '"', function(error, rows) {
        if (!error) {
          if (!rows[0]) {
            req.db.query('INSERT INTO shops (shop,token) VALUES ("' + req.session.shop + '","' + req.session.token + '")', function(e, r) {
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
              } else {
                console.log(error);
              }
            });
          } else {
            res.redirect('/render');
          }
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
    }

  });
});

module.exports = router;
