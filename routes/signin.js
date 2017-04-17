var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.user&&!req.session.user.guest)
	req.session.user=0;
  res.render('signin', { title: 'Login-Triangle Food Service', cartTotal: "$0.00", user:req.session.user});
});

module.exports = router;
