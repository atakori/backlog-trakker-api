const express= require("express");
const bodyParser= require("body-parser");
const auth= require("../controllers/auth");
const passportService= require('../services/passport');
const passport= require('passport');

const router = express.Router();
const jsonParser = bodyParser.json();

const requireAuth= passport.authenticate('jwt', { session: false });

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', requireAuth, function(req, res) {
	res.send({hi: 'hello!'})
})

router.post('/signup', auth.signup);


module.exports = router;