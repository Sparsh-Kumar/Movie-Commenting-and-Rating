

// importing all the dependencies

const express = require ('express');
const mongoose = require ('mongoose');
const xss = require ('xss-clean');
const bodyParser = require ('body-parser');
const path = require ('path');
const { config } = require (path.resolve (__dirname, 'config', 'config'));
const cors = require ('cors');
const helmet = require ('helmet');
const port = process.env.PORT || config.PORT;

// importing the Routehandler
const { RouteHandler } = require (path.resolve (__dirname, 'RouteHandler', 'RouteHandler'));

// enable mongoose to make use of promises
// and establishing the database connection

mongoose.Promise = global.Promise;
mongoose.connect (config.database_URL)
.then (() => { console.log (`Connected to Database ${config.database_URL}`)})
.catch ((error) => { console.log (`Error ${error.message}`); });

// making the app instance of express

const app = express ();
app.use (helmet ());
app.use (cors ());
app.use (xss ());
app.use (bodyParser.json ( { limit: '10kb' } ));

// defining the /api endpoint
app.use ('/api', RouteHandler);

// making the server listen on a particular port
app.listen (port, () => {
    console.log (`https://localhost:${port}`);
})