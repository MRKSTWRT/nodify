var express = require('express');
var router = express.Router();
var config = require('../config');
var md5 = require('MD5');
var _  = require('underscore');

router.get('/', function(req, res, next) {
  //If we have a session established we can carry on or if there's no signature
  //there's no need to check
  if (req.session.shop && !req.query.signature) {
    next();
  } else {
    //If not, we'll calculate the signature and compare it to make sure the
    //request from shopify is legit.
    if (req.query.shop) {
      var params = sortObject(req.query);
      delete params.signature;
      var keys = _.keys(params);
      var values = _.values(params);
      var signature = '';
      for (var i = 0; i < keys.length; ++i) {
        signature += keys[i] + '=' + values[i];
      }
      signature = md5(config.app.sharedSecret + signature);

      if (signature === req.query.signature) {
        next();
      } else {
        res.render('noentry', {config: config});
      }
    } else {
      res.render('noentry', {config: config});
    }
  }
});

// sort on key values
function sortObject(map) {
    var keys = _.sortBy(_.keys(map), function(a) { return a; });
    var newmap = {};
    _.each(keys, function(k) {
        newmap[k] = map[k];
    });
    return newmap;
}

module.exports = router;
