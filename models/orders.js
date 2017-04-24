var mongoose = require('mongoose');


var schema = {
	userID: String,
	userInfo:Object,
	cart: Object,
	date: String,
	deliveryAddress: {
		country: String,
		streetAddress: String, 
		apt: String,
		zipCode: String,
	},
	paymentType: String,
	creditInfo: Object

}

module.exports = mongoose.model('Orders', schema);