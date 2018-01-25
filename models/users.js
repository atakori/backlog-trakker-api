const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const bcrypt= require("bcrypt-nodejs");

//Define Model
	const userSchema= new Schema({
		firstname: String,
		lastname: String,
		username: { type: String, unique: true, lowercase: true},
		password: String,
		gamecollection: [{
				name: {type:String},
				gameArtUrl: {type:String},
				gameChapters: [{type: String}],
				completedChapters: [{type: String}]
			}]
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

//help with local strategy for comparing passwords
userSchema.methods.comparePassword= function(potentialPassword, callback) {
	bcrypt.compare(potentialPassword, this.password, function(err, isMatch) {
		if (err) {return callback(err)}
			callback(null, isMatch);
	})
}

//Create the model class
const ModelClass= mongoose.model("user", userSchema)

//Export the model
module.exports= ModelClass;