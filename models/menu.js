var mongoose = require('mongoose');

var schema = {
	name: String,
	details: String,
	price: Number,
	img: String
}


module.exports = mongoose.model('Menu', schema);