var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserModel = require('../models/user.js');
var CartModel = require('../models/cart');

router.post('/', function(req,res)
{
	var body = req.body;
	if(!body.password || !body.email || !body.firstname || !body.lastname)
	{
		//Missing data
		return res.json([]);
	}
	UserModel.findOne({email: body.email.trim()},function(err,existingUser)
	{
		if(existingUser)
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

function mergeCarts(guest, user, done){
	CartModel.findOne({userID: user._id}, function(err, userCart){
		if(err)return done(err);
		CartModel.findOneAndRemove({userID: guest._id}, function(err2, guestCart){
			if(err2)return done(err2);
			if(!guestCart)return done();
			if(userCart){
				for(var i=0;i<guestCart.items.length;i++)
				{
					userCart.items.push(guestCart.items[i]);
					return done();
				}
			}else{
				guestCart.userID = user._id;
				guestCart.save(function(err3, newCart){
					if(err3) return done(err3);
					return done();
				})
			}
		})
	});
}
// router.post('/login', function(req,res,next){
// 	UserModel.findOne({email: req.body.email.trim()})
// 		.then(function(user){
// 			if(user.comparePasswords(req.body.password.trim())){

// 			}
// 			else{
// 				res.json([]);
// 			}
// 		})


// })

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

router.delete('/', function(req,res,next){

	UserModel.findOneAndRemove({email: req.body.email.trim()}, function(err,user){
		if(err){
			console.log(err);
			res.send(err);
		}
		else
		{
			res.json(user);
		}
	})
});

module.exports = router;
