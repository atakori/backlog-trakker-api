const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();
const expect= chai.expect;

const User= require('../models/users');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i=1; i<=1; i++) {
    seedData.push(generateUserData());
  }
  // this will return a promise
  return User.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function generateUserData() {
  return {
    firstname: generateFirstName(),
    lastname: generateLastName(),
    username: "Test",
    password: generateFakePasswords(),
    gamecollection:[generateSpecificGameData(), generateGameData()]
    }
}

function generateFirstName() {
	const firstNames = ['Adam', 'Sam', 'Jennifer', 'Roy'];
	return firstNames[Math.floor(Math.random() * firstNames.length)]
}

function generateLastName() {
	const lastNames = ['Johnson', 'Meda', 'Zulu', 'Stevenson'];
	return lastNames[Math.floor(Math.random() * lastNames.length)]
}

function generateUsername() {
	const usernames = ['gamer1', 'gamer2','gamer3', 'gamer4'];
	return usernames[Math.floor(Math.random() * usernames.length)]
}

function generateFakePasswords() {
	const lastNames = ['Johnson', 'Meda', 'Zulu', 'Stevenson'];
	return lastNames[Math.floor(Math.random() * lastNames.length)]
}

function generateGameData() {
	return ({
		name: generateGameName(),
		gameArtUrl: generateRandomArt(),
		gameChapters: ["test Chapter 1", "test Chapter 2", "test Chapter 3"],
		completedChapters: ["test Chapter 1"] 
		})
}

function generateSpecificGameData() {
	return ({
		name: "Mario",
		gameArtUrl: generateRandomArt(),
		gameChapters: ["test Chapter 1", "test Chapter 2", "test Chapter 3"],
		completedChapters: ["test Chapter 1"] 
		})
}

function generateGameName() {
const gameNames = ['Kingdom Hearts', 'Dark Souls', 'Nier Automata', 'Agents of Mayhem'];
	return gameNames[Math.floor(Math.random() * gameNames.length)]
}

function generateRandomArt() {
const randomArtUrls = ['//images.igdb.com/igdb/image/upload/t_thumb/lxuvogkwn3lexvr7herw.jpg','//images.igdb.com/igdb/image/upload/t_thumb/e57qvevkjfapzizl3qhn.jpg'];
	return randomArtUrls[Math.floor(Math.random() * randomArtUrls.length)]
}

/*const userSchema= new Schema({
		firstname: String,
		lastname: String,
		username: { type: String, unique: true, lowercase: true},
		password: String,
		gamecollection: [{
				name: {type:String},
				gameArtUrl: {type:String},
				gameChapters: [{type: String}],
				completedChapters: [{type: String}]
			}]
	});*/

describe('Testing API Route GET endpoints', function() {
     before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

   it('should find the game and return a true value', function() {
     return chai.request(app)
       .get('/api/user/collection')
       .query({username: 'test', name:'Mario'})
       .then(function(res) {
         res.should.have.status(200);
         res.should.be.json;
         res.body.should.be.true;
       });
   });

   it('should NOT find game and return a false value', function() {
     return chai.request(app)
       .get('/api/user/collection')
       .query({username: 'test', name:'Random Game'})
       .then(function(res) {
         res.should.have.status(204);
         res.body.should.be.empty;
       });
   });

   it('should find the game and return the searchec game Object', function() {
   	return chai.request(app)
   	.get('/api/user/getGames')
   	.query({username: 'test', name:'Mario'})
   	.then(function(res) {
   		res.should.have.status(200);
   		res.body[0].should.have.keys('_id', 'gameArtUrl', 'name', 'completedChapters', 'gameChapters');
   		res.body.should.have.keys('0');
   	})
   })

   it('should return the entire gamecollection Object', function() {
   	return chai.request(app)
   	.get('/api/user/getGames')
   	.query({username: 'test'})
   	.then(function(res) {
   		res.should.have.status(200);
   		res.body[0].should.have.keys('_id', 'gameArtUrl', 'name', 'completedChapters', 'gameChapters');
		expect(res.body).to.have.length.above(1);
   	})
   })

/*   it('should NOT find the game and return the gamecollection Object', function() {
   	
   })*/
 });