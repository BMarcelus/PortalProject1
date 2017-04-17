var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Login-Triangle Food Service', cartTotal: "$0.00"});
});

module.exports = router;
