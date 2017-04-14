var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var MenuModel = require("../models/menu");

router.post('/', function(req,res)
{
	var body = req.body;

	var newMenu = new MenuModel(body);
	newMenu.save(function(err, doc)
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

/* GET home page. */
router.get('/', function(req, res) {
	// TODO: get all menu items
	MenuModel.find({}, function(err, docs)
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
