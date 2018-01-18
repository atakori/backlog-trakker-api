exports.CLIENT_ORIGIN;
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/backlog-trakker-app';
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-backlog-trakker-app';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = "iufohafihkawds"