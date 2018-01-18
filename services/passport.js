const passport= require('passport');
const User = require('../models/users');
const { JWT_SECRET } = require('../config');
const JwtStrategy= require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//setup Options for JWT Strategy
	//tells where the jwt is located
const jwtOptions= {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}

//Create the JWT strategy
const jwtLogin= new JwtStrategy(jwtOptions, function(payload, done) {
	//see if userID in payload exists in the db
	//if yes, call done with the user
	//if not, call done without the user object
	User.findById(payload.sub, function(err, user) {
		if (err) { return done(err, false) }
		if(user) {
			done(null, user)
		} else {
			done(null, false)
		}
	})
})

//Tell passport to use the strategy
passport.use(jwtLogin);