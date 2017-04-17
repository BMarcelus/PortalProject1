var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	var userName = "";
	if(req.session.user)userName = req.session.user.firstname;
  res.render('index', { title: 'Home-Triangle Food Service', cartTotal: "$0.00", user: req.session.user});
});

module.exports = router;
