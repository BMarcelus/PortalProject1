var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserModel = require('../models/user.js');

router.post('/', function(req,res)
{
	var body = req.body;
	UserModel.findOne({email: body.email.trim()},function(err,doc1)
	{
		if(doc1)
		{
			return res.json([]);
		}
		else
		{
			var newUser = new UserModel(
				{
					password: UserModel.hashPassword(body.password),
					email: body.email.trim(),
					firstname: body.firstname.trim(),
					lastname: body.lastname.trim()
				});
			newUser.save(function(err, user)
			{
				if(err)
				{
					console.log(err);
					res.send(err);
				} else {
					req.session.user = user.toJson();
					res.json(user.toJson());
				}
			});
		}
	});
	
});

router.post('/login/', function(req, res, next) {
	UserModel.findOne({email: req.body.email.trim()}, function(err, user)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else if(user)
		{
			if(user.comparePasswords(req.body.password.trim()))
			{
				if(req.session.user)
				{

				}
				req.session.user = user.toJson();
				res.json(user.toJson());
			}else
			res.json([]);
		}
		else
		{
			res.json([]);
		}
	});
});

module.exports = router;
