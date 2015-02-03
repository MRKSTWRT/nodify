var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var config = require('../config');

router.post('/', function(req, res) {
  var hash = crypto.createHmac('SHA256', config.app.sharedSecret).update(new Buffer(req.rawBody, 'utf8')).digest('base64');
  if (hash == req.headers['x-shopify-hmac-sha256']) {
    req.knex('shops')
    .where('shop', '=', req.headers['x-shopify-shop-domain'])
    .del()
    .exec(function(error, rows) {
      if (!error) {
        res.send(200);
      } else {
        console.log(error);
      }
    });
  }
});

module.exports = router;
