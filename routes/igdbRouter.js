//ALL endpoint requests for /games
const express = require('express');
const bodyParser= require("body-parser");
const {IGDB_REQUEST_URL, IGDB_KEY}= require('../config');
const request= require("request");
const axios= require('axios');

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function(req,res) {
	axios.get(`${IGDB_REQUEST_URL}/games/?search=${req.query.name}&fields=name`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
	.then(res => axios.get(`${IGDB_REQUEST_URL}/games/${res.data[0].id}`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
	.then(res => { 
		return res.data
	})
	)
	.then( gamedata => {
		res.status(200).send(gamedata);
	})
	.catch(err => console.log("ERROR"))
})

router.get('/genre', function(req,res) {
	axios.get(`${IGDB_REQUEST_URL}/genres/${req.query.ids}?fields=name`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
	.then( genreObjects => {
		let genreNames= [];
		let allGenres= genreObjects.data
		allGenres.map(genre => {
			genreNames.push(genre.name)
		})
		res.status(200).send(genreNames)
	})
	.catch(err => {console.log(err)})
})

router.get('/similarGames', function(req,res) {
	axios.get(`${IGDB_REQUEST_URL}/games/${req.query.gameIds}?fields=name`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
	.then(gameObjects => {
		let gamesArray= []
		let allGames= gameObjects.data;
		allGames.map(game => {
			gamesArray.push(game.name)
		})
		res.status(200).send(gamesArray)
	})
	.catch(err => {console.log(err)})
});


module.exports = router;