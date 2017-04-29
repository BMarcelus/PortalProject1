var mongoose = require('mongoose');

var schema = {
	name: String,
	code: { type: [String], index: true, unique: true },
	discountType: String,
	discount: Number,
	numberOfUses: Number,
	enabled: Boolean
}


module.exports = mongoose.model('Coupon', schema);