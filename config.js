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

// IGDB INFO (Test Account: riku12764)
exports.IGDB_REQUEST_URL= "https://api-2445582011268.apicast.io";
exports.IGDB_KEY= "92e467edf212568a890c3afd82d9198d";
