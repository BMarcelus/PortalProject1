var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserModel = require('../models/user.js');



// function add13(password)
// {
// 	var result = "";
// 	for(var i=0;i<password.length;i++)
// 	{
// 		result += String.fromCharCode( password.charCodeAt(i)+13 );
// 	}
// 	return result;
// }
// function hashPassword(password,salt)
// {
// 	// return add13(password);
// 	// return hash2(password);

// 	return bcrypt.hashSync(password, salt);
// }
// function randomSalt()
// {
// 	return bcrypt.genSaltSync(saltRounds);
// 	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
// 	var result = "";
// 	for(var i =0;i<10;i++)
// 	{
// 		result += chars[Math.floor(Math.random()*chars.length)];
// 	}
// 	return result;
// }

// function hash2(string){
//     if (Array.prototype.reduce){
//         return string.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
//     } 
//     var hash = 0;
//     if (string.length === 0) return hash;
//     for (var i = 0; i < string.length; i++) {
//         var character  = string.charCodeAt(i);
//         hash  = ((hash<<5)-hash)+character;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }

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
			newUser.save(function(err, doc)
			{
				if(err)
				{
					console.log(err);
					res.send(err);
				} else {
					console.log(doc);
					// doc.password="protected";
					req.session.user = doc.toJson();
					console.log(req.session);
					res.json(doc.toJson());
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
