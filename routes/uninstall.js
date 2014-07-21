var express = require('express');
var router = express.Router();
var crypto = require('crypto');

router.post('/', function(req, res) {
  var hash = crypto.createHmac("SHA256", '36f0694f9b9f70ee36184900dc617f37').update(new Buffer(req.rawBody, 'utf8')).digest('base64');
  if (hash == req.headers['x-shopify-hmac-sha256']) {
    var query = "DELETE FROM shops WHERE shop = '" + req.headers['x-shopify-shop-domain'] + "'";
    req.db.query(query, function(error, rows) {
      if (!error) {
        res.send(200, '');
      } else {
        console.log(error);
      }
    });
  }
});

module.exports = router;
