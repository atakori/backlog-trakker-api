const express= require("express");
const bodyParser= require("body-parser");
const auth= require("../controllers/auth");

const router = express.Router();
const jsonParser = bodyParser.json();


router.use(bodyParser.urlencoded({extended: true}));

router.post('/signup', auth.signup);

module.exports = router;