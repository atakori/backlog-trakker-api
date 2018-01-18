const mongoose= require("mongoose");
const Schema= mongoose.Schema;

//Define Model
	const userSchema= new Schema({
		firstname: String,
		lastname: String,
		username: { type: String, unique: true, lowercase: true},
		password: String
	});

//Create the model class
const ModelClass= mongoose.model("user", userSchema)

//Export the model
module.exports= ModelClass;