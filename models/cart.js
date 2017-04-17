var mongoose = require('mongoose');

var schema = {
	menuID: String,
	userID: String,
	quantity: Number
}


module.exports = mongoose.model('Cart', schema);