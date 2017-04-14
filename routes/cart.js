var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CartModel = require("../models/cart");

router.post('/', function(req,res)
{
	var body = req.body;

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
	console.log("in patch");
	console.log(req.params.objectId);
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
	CartModel.find({}, function(err, docs)
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
