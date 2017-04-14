var mongoose = require('mongoose');

var schema = {
	menuID: String,
	quantity: Number
}


module.exports = mongoose.model('Cart', schema);