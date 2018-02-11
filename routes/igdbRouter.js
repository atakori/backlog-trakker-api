//ALL endpoint requests for /games
const express = require('express');
const bodyParser= require("body-parser");
const {IGDB_REQUEST_URL, IGDB_KEY}= require('../config');
const request= require("request");
const axios= require('axios');
const cheerio= require('cheerio');

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
		console.log(gamedata);
		res.status(200).send(gamedata);
	})
	.catch(err => {
		console.log(err)
		res.status(400).send(err)
	})
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


//GET request to get similarGame names and Box Arts
router.get('/similarGames', function(req,res) {
	axios.get(`${IGDB_REQUEST_URL}/games/${req.query.gameIds}?fields=name,cover`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
	.then(gameObjects => {
		let gamesArray= []
		let allGames= gameObjects.data;
		let gamesObject= allGames.map(game => {
			return {name: game.name, gameArtUrl: game.cover.url}
		})
		/*allGames.map(game=> {
			gamesArray.push(game.name)
		})*/
		/*res.status(200).json(gamesArray)*/
		res.status(200).json(gamesObject)
	})
	.catch(err => {console.log(err)})
});

function getGameChaptersFromHtml(html) {
	//using cheerio to map through chapters and return array
	let chaptersArray= [];
	$= cheerio.load(html);
	if($(".ghn-L1.ghn-hasSub.ghn-open.ghn-active")[0] === undefined) {
		return "error";
	} else {
	const chaptersObjects= JSON.parse($(".ghn-L1.ghn-hasSub.ghn-open.ghn-active")[0].attribs["data-sub"])
	chaptersObjects.map(chapterobject => {
		chaptersArray.push(chapterobject.label)
	})
	return chaptersArray;
	}
}

router.get('/chapters', function(req,res) {
	const options = {
		headers: {'user-agent': 'node.js'}
	}
	request(`http://www.ign.com/wikis/${req.query.gameName}/Walkthrough`, options, function (error,response, body) {
		if(!error) {
			let chapterArray= getGameChaptersFromHtml(body)
			console.log(chapterArray)
			if(chapterArray !== "error") {
				res.status(200).send(chapterArray)
			} else {
				console.log("SENDING ERROR BACK")
				res.status(500).send(error);
			}
		} else {
			res.status(500).send(error);
		}
	})
})

router.get('/searchGames', function(req,res) {
  axios.get(`${IGDB_REQUEST_URL}/games/?search=${req.query.value}&fields=name&filter[version_parent][not_exists]=1&limit=5`, {
		headers: {"user-key": `${IGDB_KEY}`, Accept: "application/json"}
	})
  .then(response => {
  	res.status(200).json(response.data);
  })
  .catch(err => {console.log(err)})
})


module.exports = router;