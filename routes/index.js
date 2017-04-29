var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var userName = "";
	if(req.session.user)userName = req.session.user.firstname;
  res.render('index', { title: 'Home-Triangle Food Service', cartTotal: "$0.00", user: req.session.user});
});

router.get('/checkout', function(req, res, next) {
	var cartTotal = "$0.00";
	var user;
	if(req.session.user)
		user=req.session.user;
	else
		user={}
	if(req.session.user&&req.session.user.totalPrice)
	{
		cartTotal = "$" + req.session.user.totalPrice;
	}
	else
	{
		res.redirect('/');
		return;
	}
  res.render('checkout', { title: 'Cart-Triangle Food Service', cartTotal: cartTotal, user:user});
});

router.get('/cartpage', function(req, res, next) {
  res.render('cart', { title: 'Cart-Triangle Food Service', cartTotal: "$0.00", user: req.session.user});
});

router.get('/signin', function(req, res, next) {
	if(req.session.user&&!req.session.user.guest)
	{
		if(req.session.guestID){
			req.session.user = {_id: req.session.guestID, guest: true}
		}
		else{
			req.session.user=0;
		}
	}
  res.render('signin', { title: 'Login-Triangle Food Service', cartTotal: "$0.00", user:req.session.user});
});

router.get('/admin', function(req, res, next) {
	if(!req.session.user||req.session.user.guest)
	{
		return res.redirect('/signin');
	}
	var cartTotal=0;
	if(req.session.user&&req.session.user.totalPrice)
	{
		cartTotal = "$" + req.session.user.totalPrice;
	}
  res.render('admin', { title: 'Admin-Triangle Food Service', cartTotal, user:req.session.user});
});

router.get('/receipt', function(req,res,next){
	var cartTotal = "$0.00";
	var user;
	if(req.session.user)
		user=req.session.user;
	if(req.session.user&&req.session.user.totalPrice)
	{
		cartTotal = "$" + req.session.user.totalPrice;
	}
	res.render('receipt', {title: 'Receipt-Triangle Food Service', cartTotal:cartTotal, user:req.session.user})
})

module.exports = router;
