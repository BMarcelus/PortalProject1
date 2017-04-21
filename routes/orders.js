var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var OrderModel = require("../models/orders");
var MenuModel = require("../models/menu");

router.post('/', function(req,res)
{
	if(!req.session.user)
	{
  		res.status(500).send('No user in session')
	}
	var body = req.body;
	body.userID = req.session.user._id;
	body.date = new Date();


	var newOrder = new OrderModel(body);
	newOrder.save(function(err, menu)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		} else {
			res.json(menu);
		}
	});
});

/* GET home page. */
router.get('/', function(req, res) {
	OrderModel.find({}, function(err, menu)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			res.json(menu);
		}
	});
});

module.exports = router;
