const express= require("express");
const bodyParser= require("body-parser");
const auth= require("../controllers/auth");
const passportService= require('../services/passport');
const passport= require('passport');

const router = express.Router();
const jsonParser = bodyParser.json();

const requireAuth= passport.authenticate('jwt', { session: false });
const requireLogin= passport.authenticate('local', { session: false });

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', requireAuth, function(req, res) {
	res.send({message: 'Secret code is abc123'})
})

router.post('/login', requireLogin, auth.login);
router.post('/signup', auth.signup);


module.exports = router;