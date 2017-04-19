var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var MenuModel = require("../models/menu");

router.post('/', function(req,res)
{
	var body = req.body;

	var newMenu = new MenuModel(body);
	newMenu.save(function(err, menu)
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
	MenuModel.find({}, function(err, menu)
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
