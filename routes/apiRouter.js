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
    let chapters = req.query.gameChapters;
    chapters= chapters.split(",")
    console.log(chapters)
    //post game and chapters
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
//GET router for checking the database for seeing if game is
//in user's game collection
router.get('/user/collection', function(req,res) {
  console.log("CHECKING USER'S COLLECTION");
  User
  .findOne({username: req.query.username})
  .find({"gamecollection.name": req.query.name})
  .then(gameStatus => {
    if(!gameStatus.length) {
      //if not found it returns false
      console.log("Game NOT in Collection")
      res.status(200).send(false);
    } else {
      console.log("Game FOUND in Collection")
      //if found, it returns true
      res.status(200).send(true);
    }
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