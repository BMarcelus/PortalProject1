var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var uuidV1 = require('uuid/v1');

var CartModel = require("../models/cart");

//ttl 
//cronjob


router.post('/', function(req,res)
{
	var body = req.body;
	if(!req.session.user)req.session.user = {_id: uuidV1(), guest: true};
	var userID = req.session.user._id;
	var totalPrice=body.totalPrice ? parseInt(body.totalPrice) : 0; 
	req.session.user.totalPrice = totalPrice;
	body.userID=userID;
	var items= body.items || [];
	var cartBody = {
		userID,
		items,
		totalPrice
	}
	CartModel
		.findOneAndUpdate({ userID }, cartBody, {upsert: true, new:true})
		.then(function(updatedCart)		{
			if(updatedCart)			{
				res.json(updatedCart);
			}
			else
				res.json([]);
		})
		.catch(function(err){
			res.send(err);
		});
});

router.get('/', function(req, res) {
	if(!req.session.user){
		res.json({});
		return;
	}
	CartModel.findOne({userID: req.session.user._id}, function(err, cart){
		if(err)		{
			console.log(err);
			res.send(err);
		}
		else {
			if(cart)
				res.json(cart);
			else {
				res.json({});
			}
		}
	});
});

module.exports = router;
