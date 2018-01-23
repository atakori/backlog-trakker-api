//Router for /api routes

const express= require("express");
const bodyParser= require("body-parser");
const passport= require('passport');


const router = express.Router();
const jsonParser = bodyParser.json();

const requireAuth= passport.authenticate('jwt', { session: false });
const requireLogin= passport.authenticate('local', { session: false });

router.use(bodyParser.urlencoded({extended: true}));

router.get('/user', requireAuth, function (req,res) {
    const username= req.user.username;
    console.log(username);
    res.status(200).send(username);
})

module.exports = router;