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
			// body.password=hashPassword(body.password,body.salt);
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
					console.log(user);
					// doc.password="protected";
					req.session.user = user.toJson();
					console.log(req.session);
					res.json(user.toJson());
				}
			});
		}
	});
	
});

/* GET users listing. */
router.post('/login/', function(req, res, next) {
	console.log(req.body);
	UserModel.findOne({email: req.body.email.trim()}, function(err, user)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else if(user)
		{
			console.log(user);
			// if(doc.password == hashPassword(req.body.password.trim(), us.salt))
			if(user.comparePasswords(req.body.password.trim()))
			{
				console.log("logged in");
				req.session.user = user.toJson();
				res.json(user.toJson());
			}else
			res.json([]);
			// res.status(401).json("invalid credentials");
		}
		else
		{
			res.json([]);
		}
	});
});

module.exports = router;
