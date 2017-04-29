var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CouponModel = require("../models/coupon");
var CartModel = require("../models/cart");
var MenuModel = require("../models/menu");

function findById(menu, id){
	for(var i =0;i<menu.length;i++){
		var m = menu[i];
		if(m._id == id)return m;
	}
}


function applyCoupon(cart, coupon, done){
	cart.coupon = coupon;
	cart.discountPrice = cart.totalPrice;
	if(coupon.discountType === "Percentage Off"){
		cart.discountPrice = cart.totalPrice * (100-coupon.discount)/100;
		return done(null, cart);
	}
	else if(coupon.discountType === "Flat $ Discount"){
		cart.discountPrice -= coupon.discount;
		return done(null, cart);
	}
	else if(coupon.discountType === "Buy One Get One Free")
	{
		return MenuModel.find({},function(err, menu){
			if(err)return done(err);
			var max, secondMax;
			cart.items.forEach(function(item){
				var mi = findById(menu, item.menuID);
				if(mi){
					var price = mi.price;
					if(!max||price>=max){
						secondMax=max;
						max=price;
					}
					if(item.quantity>1)secondMax=max;
				}
			})
			if(secondMax){
				cart.discountPrice-=secondMax;
			}
			return done(null, cart);
		})
	}
}

router.post('/code', function(req, res) {
	// console.log(req.)
	var code = req.body.code;
	code = code.toLowerCase();
	CouponModel.findOne({code}, function(err, coupon)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			if(!coupon){
				return res.json({invalidCode: true});
			}
			else if(coupon.numberOfUses<=0){
				return res.json({outOfUses: true})
			}
			else if(!coupon.enabled){
				return res.json({disabled: true});
			}
			{
				if(req.session&&req.session.user)
				req.session.user.coupon = coupon;
				coupon.valid=true;
				// CartModel.findOneAndUpdate({_id: req.body.cartID}, {couponID: coupon._id})
				// 	.then(function(cart){
				// 		console.log(cart);
				// 		res.json(coupon);
				// 	})
				// 	.catch(function(err){
				// 		res.send(err);
				// 	})
				var newPrice = 0;
				CartModel.findOne({_id: req.body.cartID})
					.then(function(cart){
						if(!cart){
							res.json({noCart:true});
						}else
						applyCoupon(cart, coupon, function(err2, cart){
							if(err2)return err2;
							if(cart.discountPrice<0)cart.discountPrice=0;

							newPrice=cart.discountPrice;
							req.session.user.totalPrice = newPrice;
							return cart.save()
						})
						.then(function(cart){
							// coupon.newPrice = cart.discountPrice;
							// console.log(cart.discountPrice);
							coupon.numberOfUses--;
							return coupon.save()
						})
						.then(function(coupon2){
							res.json({coupon:coupon2, newPrice});
						})
						.catch(function(err2){
							console.log(err2);
							res.send(err2);
						})

					})
					.catch(function(err2){
						console.log(err2);
						res.send(err2);
					})
			}
		}
	});
});



router.post('/', function(req,res)
{
	var body = req.body;
	body.enabled =true;
	body.code = body.code.toLowerCase();
	var newCoupon = new CouponModel(body);
	CouponModel.findOne({code: body.code})
	.then(function(existingCoupon){
		if(existingCoupon){
			return res.json(existingCoupon);
		}
		else{
			newCoupon.save(function(err, coupon)
			{
				if(err)
				{
					console.log(err);
					res.send(err);
				} else {
					coupon.new=true;
					res.json(coupon);
				}
			});
		}
	})
	.catch(function(err){
		console.log(err);
		res.send(err);
	});
	
});

router.patch('/', function(req,res)
{
	var body = req.body;

	CouponModel
	.findOneAndUpdate({ _id: body._id }, body, {new:true})
		.then(function(updatedCoupon)		{
			if(updatedCoupon)			{
				res.json(updatedCoupon);
			}
			else
				res.json([]);
		})
		.catch(function(err){
			res.send(err);
		});
});

router.get('/:id', function(req, res) {
	CouponModel.findOne({_id: req.params.id}, function(err, coupons)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			res.json(coupons);
		}
	});
});

//this is for testing cleanup
router.delete('/', function(req,res){
	CouponModel.findOneAndRemove(req.body, function(err, coupons)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			res.json(coupons);
		}
	});
})

router.get('/', function(req, res) {
	CouponModel.find({}, function(err, coupons)
	{
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		else 
		{
			res.json(coupons);
		}
	});
});

module.exports = router;
