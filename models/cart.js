var mongoose = require('mongoose');

var item = {
	menuID: String,
	quantity: Number,
}
var schema = {
	userID: String,
	totalPrice: Number,
	discountPrice: Number,
	items: [item],
	coupon: Object
}


module.exports = mongoose.model('Cart', schema);