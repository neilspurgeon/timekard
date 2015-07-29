var mongoose = require("mongoose"),
							  bcrypt = require("bcrypt"),
								salt = bcrypt.genSaltSync(10);

var userSchema = new mongoose.Schema({
								 email: {
									 	type: String,
									 	required: true,
									 	lowercase: true,
									 	index: {
									 		unique: true
									 	}
								 	}, 
								 passwordDigest: {
								 	type: String, 
								 	required: true
								 },
								 name: {
								 	first: {
								 		type: String,
								 		required: true
								 	},
								 	last: {
								 		type: String,
								 		required: true
								 	}
								 }
});

userSchema.statics.createSecure = function (email, password, passwordConfirm, first, last, cb) {
	var that = this;
	// hash the password
	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			that.create(
			{ email: email, passwordDigest: hash,
				name: { first: first, last: last }
			}, cb);
		});
	});
};

userSchema.statics.encryptPassword = function (password) {
	var hash = bcrypt.hashSync(password, salt);
	return hash;
};

userSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

userSchema.statics.authenticate = function(email, password, cb) {
	this.findOne({
		email: email
	},
	function(err, user){
		if (user === null){
			console.log("ERR: Username not found");
			throw new Error("Username not found");
		} else if (user.checkPassword(password)){
			cb(null, user);
		}
	});
};

var User = mongoose.model("User", userSchema);

module.exports = User;

