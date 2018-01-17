 const express = require('express');
 const bodyParser= require('body-parser');
 const morgan = require('morgan');
 const app = express();
 const routesRouter= require('./routes/router');


const PORT = process.env.PORT || 3000;
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

//App Setup
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use('/', routesRouter)

//Server Setup
 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};