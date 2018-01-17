const express= require("express");
const bodyParser= require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();


router.use(bodyParser.urlencoded({extended: true}));

router.get("/", function(req,res,next) {
	res.send(["waterbottle", "phone", "paper"])
})

module.exports = router;