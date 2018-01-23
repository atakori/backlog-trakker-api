//Router for /api routes

const express= require("express");
const bodyParser= require("body-parser");
const passport= require('passport');
const User= require('../models/users');


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

//router for adding games to user's collection
router.post('/user', /*requireAuth,*/ function(req,res) {
    console.log(req.query);
    console.log(req.query.username);
    console.log(req.query.name)
    let chapters = req.query.gameChapters;
    chapters= chapters.split(",")
    console.log(chapters)
    //post game and chapters
    // TEST
    //
    User
    .findOne({username: req.query.username})
    .update({$push: {gamecollection: {name: req.query.name, gameChapters: req.query.gameChapters.split(",")}}})
    .then( gamesObject=> {
      console.log("Game and Chapters added");
      console.log(gamesObject);
      res.status(200).send(gamesObject)
    })
    .catch(err=> {console.log(err)})
})
/*  const userSchema= new Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true, lowercase: true},
    password: String,
    gamecollection: [{
        name: {type:String},
        gameChapters: [{type: String}],
        completedChapters: [{type: String}]
      }]
  });*/
module.exports = router;