var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var uuidV1 = require('uuid/v1');

var CartModel = require("../models/cart");


router.post('/', function(req,res)
{
	var body = req.body;
	if(req.session.user)
		body.userID = req.session.user._id;
	else
	{
		console.log("Guest User generating id");
		var id = uuidV1();
		console.log(id);
		req.session.user = {_id: id, guest: true};
	}
	var newCart = new CartModel(body);
	newCart.save(function(err, doc)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		} else {
			console.log(doc);
			res.json(doc);
		}
	});
});

router.patch('/:objectId', function(req,res){
	var body = req.body;
	// console.log(req);
	CartModel.findOneAndUpdate({_id: req.params.objectId}, body, function(err, doc){
	    if (err)
	    {
	    	console.log(err);
	     	res.send(err);
	    }
	    else
	    {
			console.log(doc);
			res.json(doc);
			// res.send("a");	
	    }
	});
});

router.delete('/:id', function(req,res){
	var body = req.body;
	CartModel.findOneAndRemove({ _id: req.params.id}, function(err,doc) {
    if (!err) {
    	console.log(err);
    	res.send(err);	
    }
    else {
    	console.log(doc);
    	// res.json([]);
    	res.send("a");
    }
	});
});

/* GET home page. */
router.get('/', function(req, res) {
	// TODO: get all menu items
	CartModel.find({userID: req.session.user._id}, function(err, docs)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			res.json(docs);
		}
	});
});

module.exports = router;
