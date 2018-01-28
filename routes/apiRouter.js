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
    res.status(200).send(username);
})

//router for adding games to user's collection
router.post('/user', /*requireAuth,*/ function(req,res) {
    let chapters = req.query.gameChapters;
    chapters= chapters.split(",")
    //post game and chapters
    User
    .findOne({username: req.query.username})
    .update({$push: {gamecollection: {name: req.query.name, gameArtUrl: req.query.gameArtUrl, gameChapters: req.query.gameChapters.split(",")}}})
    .then( gamesObject=> {
      console.log("Game and Chapters added");
      res.status(201).send(gamesObject)
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
      res.status(204).send(false);
    } else {
      console.log("Game FOUND in Collection")
      //if found, it returns true
      res.status(200).send(true);
    }
  })
  .catch(err=> {console.log(err)})
  })

//GET router for returning a user's gameCollection
router.get('/user/getGames', function(req,res) {
  console.log("Fetching games");
  //if a specific game name is supplied
  //return that specific game info
  if(req.query.name) {
    User
    .findOne({username: req.query.username}, {"gamecollection": {$elemMatch: {name: req.query.name}}})
    .then( gameObject => {
      res.status(200).json(gameObject.gamecollection);
    })
  } else {
  User
  .findOne({username: req.query.username})
  .select("gamecollection")
  .then(gamecollection => {
    res.status(200).json(gamecollection.gamecollection);
  })
  .catch(err=> {console.log(err)})
  }
}
)

//Route for getting user's entire backlog collection
router.get('/user/getUserBacklog', function(req,res) {
  console.log("Fetching Backlog");
    User
    .findOne({username: req.query.username})
    .select("gamecollection")
    .then(gamecollection => {
      res.status(200).json(gamecollection.gamecollection);
    })
    .catch(err=> {console.log(err)})
  })

router.get('/user/handleChapter', function(req,resp) {
  console.log("Searching for gameChapter");
  User
  .findOne({username: req.query.username})
  .find({"gamecollection.completedChapters": req.query.chapter})
  .then(res => {
    //if not found (empty array as response)
    //add the chapter to the array
    if(!res.length) {
      let finalRes= resp;
      User
      .update({username: req.query.username, "gamecollection.name": req.query.name}, {"$push": {"gamecollection.$.completedChapters": req.query.chapter}})
      .then(response =>{
        console.log("Chapter successfully added");
        //then return the modified game object
        User
        .findOne({username: req.query.username})
        .select("gamecollection")
        .then(gamecollection => {
          finalRes.status(200).json(gamecollection.gamecollection);
        })
        .catch(err=> {console.log(err)})
      })
    } else {
      //if found, remove chapter from array
      let finalRes= resp;
      User
      .update({username: req.query.username, "gamecollection.name": req.query.name}, {"$pull": {"gamecollection.$.completedChapters": req.query.chapter}})
      .then( response =>{
        console.log("Chapter Removed");
        //then return the modified game Object
        User
        .findOne({username: req.query.username})
        .select("gamecollection")
        .then(gamecollection => {
          finalRes.status(200).json(gamecollection.gamecollection);
        })
        .catch(err=> {console.log(err)})
      })
    }
  })
  .catch(err => {console.log(err)})
  //search user's gameCollection for game
  //look through completedChapters array for chapter name //if found, pull(delete) the chapter from array
  //if not found, add name to array
  //dispatch GET_GAME_COLLECTION to ReRender
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