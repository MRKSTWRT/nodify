var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (!req.session.token) {
    req.session.shop = req.query.shop;
    res.redirect('/esc');
  } else {
    req.db.query("SELECT * FROM shops WHERE token = '" + req.session.token + "'", function(error, rows) {
      if (!error) {
        if (!rows[0]) {
          req.session.token = null;
          req.session.shop = req.query.shop;
          res.redirect('/esc');
        } else {
          res.redirect('/render');
        }
      } else {
        console.log(error);
      }
    });
  }
});

module.exports = router;
