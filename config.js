exports.CLIENT_ORIGIN;
exports.DATABASE_URL =
    process.env.MONGODB_URI ||
    global.DATABASE_URL ||
    'mongodb://localhost/backlog-trakker-app';
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-backlog-trakker-app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = "iufohafihkawds";

// IGDB INFO (Test Account: atakori)
exports.IGDB_REQUEST_URL= "https://api-endpoint.igdb.com";
exports.IGDB_KEY= "0be2044d95caf78fcbbef802fefd56ea";
