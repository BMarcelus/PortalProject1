var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var userName = "";
	if(req.session.user)userName = req.session.user.firstname;
  res.render('index', { title: 'Home-Triangle Food Service', cartTotal: "$0.00", user: req.session.user});
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'Cart-Triangle Food Service', cartTotal: "$0.00", user:req.session.user});
});

router.get('/cartpage', function(req, res, next) {
  res.render('cart', { title: 'Cart-Triangle Food Service', cartTotal: "$0.00", user: req.session.user});
});

router.get('/signin', function(req, res, next) {
	if(req.session.user&&!req.session.user.guest)
	req.session.user=0;
  res.render('signin', { title: 'Login-Triangle Food Service', cartTotal: "$0.00", user:req.session.user});
});

module.exports = router;
