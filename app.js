var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var exphbs = require('express-handlebars');
PORT        = 7513;                 // Set a port number at the top so it's easy to change in the future

// handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static("static"))


// Database
var db = require('./db-connector')
/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('homePage');
});

app.get('/Clubs', function(req, res) {
    res.render('clubs');
});

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
    res.render('clubParticipation');
});

/*
app.get('/', function(req, res)
    {
        // Define our queries
        query1 = 'DROP TABLE IF EXISTS diagnostic;';
        query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
        query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working for sullivk3!")'; //replace with your ONID
        query4 = 'SELECT * FROM diagnostic;';

        // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

        // DROP TABLE...
        db.pool.query(query1, function (err, results, fields){

            // CREATE TABLE...
            db.pool.query(query2, function(err, results, fields){

                // INSERT INTO...
                db.pool.query(query3, function(err, results, fields){

                    // SELECT *...
                    db.pool.query(query4, function(err, results, fields){

                        // Send the results to the browser
                        let base = "<h1>MySQL Results:</h1>"
                        res.send(base + JSON.stringify(results));
                    });
                });
            });
        });
    });
*/
/*
    LISTENER
*/
app.listen(PORT, function(){      
    console.log('Express started on http://localhost:' + PORT);
});