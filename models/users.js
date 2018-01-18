const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const bcrypt= require("bcrypt-nodejs");

//Define Model
	const userSchema= new Schema({
		firstname: String,
		lastname: String,
		username: { type: String, unique: true, lowercase: true},
		password: String
	});

//On Save, encrypt user password
userSchema.pre('save', function(next) {
	const user= this;

	if(!user.password) {
		next();
	}

	//generating a salt and run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err) }

		//encrypt password with salt
		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if(err) { return next(err) }
			//overwrite password with encrypted password
			user.password=hash;
			next();
		})
	})
})

//Create the model class
const ModelClass= mongoose.model("user", userSchema)

//Export the model
module.exports= ModelClass;