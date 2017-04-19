var mongoose = require('mongoose');

var item = {
	menuID: String,
	quantity: Number
}
var schema = {
	userID: String,
	totalPrice: Number,
	items: [item]
}


module.exports = mongoose.model('Cart', schema);