var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var exphbs = require('express-handlebars');
PORT        = 7513;                 // Set a port number at the top so it's easy to change in the future

// handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.json()) // Taken from https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.use(express.urlencoded({extended: true})) // Taken from https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.use(express.static("static"))


// Database
var db = require('./database/db-connector')
/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('homePage');
});


// Citation for the following function app.get function (specifically the query parts)
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
app.get('/Clubs', function(req, res) {
    let query1 = "SELECT * FROM Clubs"                     // Define our query

    db.pool.query(query1, function(error, rows, fields){ // Execute the query

        res.render('clubs', {data:rows});                  // Render clubs.handlebars file, and also send the renderer                                             
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                        // received back from the query

app.get('/Students', function(req, res) {
    res.render('students');
});

app.get('/Events', function(req, res) {
    res.render('events');
});

app.get('/Categories', function(req, res) {
    res.render('categories');
});

app.get('/ClubParticipation', function(req, res) {
    let query1 = "SELECT * FROM Club_Participation"       // Define query

    db.pool.query(query1, function(error, rows, fields){ // Execute query
        res.render('clubParticipation', {data:rows});    // Renders with the data
    }) 
});


/*
    LISTENER
*/
app.listen(PORT, function(){      
    console.log('Express started on http://localhost:' + PORT);
});