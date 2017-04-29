var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var saltRounds= 10;

var schema = mongoose.Schema({
	email: String,
	password: String,
	firstname: String,
	lastname: String,
	phone: String,
	
})

schema.methods.toJson = function()
{
	var obj = this.toObject();
	delete obj.password;
	return obj;
}

schema.statics.hashPassword = function(password)
{
	return bcrypt.hashSync(password, saltRounds);
}

schema.methods.comparePasswords = function(password)
{
	return bcrypt.compareSync(password,this.password);
}


module.exports = mongoose.model('User', schema);



