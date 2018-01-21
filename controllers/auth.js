const User= require('../models/users');
const jwt= require('jwt-simple');
const {JWT_SECRET} = require('../config');

function tokenForUser(user) {
	const timestamp= new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, JWT_SECRET)
}

exports.login = function(req, res, next) {
	//User is authorized, this gives a token
	res.send({token: tokenForUser(req.user)})
}

exports.signup= function(req, res, next) {
	const firstname= req.body.firstname;
	const lastname= req.body.lastname;
	const username= req.body.username;
	const password= req.body.password;

	if(!username || !password) {
		return res.status(422).send({error: 'Please provide an email and password'})
	}

	//see if user with given username exists
	User.findOne({username: username}, function(err, existingUser) {
		if(err) {
			return next(err);
		}

		//if username exists, return an error
		if(existingUser) {
			return res.status(422).send({error: 'Username already in use'})
		}
		//if a username does not exist, create and save user record
		const user= new User({
			firstname: firstname,
			lastname: lastname,
			username: username,
			password: password
		});
		user.save(function(err) {
			if (err) {return next(err);}
		//respond to request indicating user was created
		res.json({token: tokenForUser(user)});
		})
	})
}