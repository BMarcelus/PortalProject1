var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var OrderModel = require("../models/orders");
// var MenuModel = require("../models/menu");
var CartModel = require("../models/cart");

router.post('/', function(req,res)
{
	if(!req.session.user)
	{
  		res.status(500).send('No user in session')
  		return;
	}
	if(!req.body.cart)
	{
		res.status(500).send('No cart in order');
		return;
	}
	var body = req.body;
	body.userID = req.session.user._id;
	body.date = new Date();

	req.session.user.country = body.deliveryAddress.country;
	req.session.user.address = body.deliveryAddress.streetAddress;
	req.session.user.apt = body.deliveryAddress.apt;
	req.session.user.zipCode = body.deliveryAddress.zipCode;
	req.session.user.phone = body.userInfo.phone;
	req.session.paymentType = body.paymentType;

	var cart = body.cart;

	var newOrder = new OrderModel(body);
	newOrder.save(function(err, order) {
		if(err)
		{
			console.log(err);
			res.send(err);
		} else {
			req.session.user.order = order;
			// res.json(order);
			CartModel.findOneAndRemove({_id: cart._id},function(err,cart){
				if(err)
				{
					console.log(err);
					res.send(err);
				}
				else
				{
					req.session.user.totalPrice=0;
					res.json(order);
				}
			})
		}
	});
});

router.get('/', function(req, res) {
	if(!req.session.user||!req.session.user.order){
		res.json({});
		return;
	}
	OrderModel.findOne({_id: req.session.user.order._id}, function(err, menu)
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

router.get('/all', function(req, res) {
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



//TODO:
/*
Guest cart should be added to user account when signing in - upon verification
info should be saved to user upon checkout
Receipt page should get order

Look into
	Bootstrap
	Stripe

Redo Frontend 
	style and structure

Restructure cart to contain Menu Objects instead of IDs



*/
