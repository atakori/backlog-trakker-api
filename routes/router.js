const express= require("express");
const bodyParser= require("body-parser");
const auth= require("../controllers/auth");
const passportService= require('../services/passport');
const passport= require('passport');
/*const webdriverio = require('webdriverio')*/
const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
	desiredCapabilities: {
		browserName: 'firefox'
	}
};

const router = express.Router();
const jsonParser = bodyParser.json();

const requireAuth= passport.authenticate('jwt', { session: false });
const requireLogin= passport.authenticate('local', { session: false });

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', requireAuth, function(req, res) {
	/*let game_url_info= 'http://www.ign.com/wikis/dark-souls-3/Walkthrough'
	webdriverio.remote(options).init().url(game_url_info).getTitle()
	.then( title => { console.log(title)})
	.status(204)*/
	const options = {
  uri: `https://www.google.com`,
  transform: function (body) {
    return cheerio.load(body);
  }
};
	rp(options)
  .then(($) => {
    console.log($.html);
  })
  .catch((err) => {
    console.log(err);
  });
})

router.post('/login', requireLogin, auth.login);
router.post('/signup', auth.signup);


module.exports = router;