const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


const UserSchema = mongoose.Schema({
	username:{
		type: String, 
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	}
});

// encrypt password before saving
UserSchema.pre('save', function(next) {
	var thisUser = this;
	bcrypt.hash(thisUser.password, null, null, function(err, hash) {
		if (err) return next(err);
		thisUser.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

const User = module.exports = mongoose.model('User', UserSchema);