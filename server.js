const express = require('express');
const bodyParser= require('body-parser');
const morgan = require('morgan');
const app = express();
const routesRouter= require('./routes/router');
const mongoose = require('mongoose');
const cors= require('cors');

const {CLIENT_ORIGIN} = require('./config');

// DB Setup

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');

//App Setup
//allow AJAX requests from alternate domains
app.use(cors());

app.use(bodyParser.json({type:'*/*'}));
app.use('/', routesRouter)



//Server Setup

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app
                .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};