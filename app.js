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
    let query1;       // Will get club_participation, dynamic based on search term

    let query2 = "SELECT * FROM Clubs"

    let query3;       // Will get students, dynamic based on search term

    // // If there is no query string, we just perform a basic SELECT
    if (req.query.studentLName === undefined)
    {
        query1 = "SELECT * FROM Club_Participation"
        query3 = "SELECT * FROM Students"
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        // we joined Club_Participation.studentId with Students so that the user can search by student last name
        query1 = `SELECT Club_Participation.clubParticipationId, Club_Participation.clubId, Club_Participation.studentId FROM Club_Participation 
                  INNER JOIN Students ON Club_Participation.studentId = Students.studentId 
                  WHERE Students.studentLName LIKE "${req.query.studentLName}%"`
        query3 = `SELECT * FROM Students WHERE studentLName LIKE "${req.query.studentLName}%"`
    } 

    db.pool.query(query1, function(error, rows, fields){ // Execute query
        // save the club_participation entries
        let club_particpations = rows

        db.pool.query(query2, function(error, rows, fields) {
            // save the student entries
            let clubs = rows;

            db.pool.query(query3, function(error, rows, fields) {
                // save the student entries
                let students = rows;

                return res.render('clubParticipation', {data:club_particpations, clubs:clubs, students:students});    // want to have third argument, students:students
            })
        })
    }) 
});

// Citation for the following app.post function 
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/add-clubParticipation-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    // All attributes in Club_Participation are non nullable, so nothing goes here

    // Create the query and run it on the database
    query1 = `INSERT INTO Club_Participation (clubParticipationId, clubId, studentId) VALUES ('${data.clubParticipationId}', '${data.clubId}', ${data.studentId})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Club_Participation;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Citation for the following app.delete function 
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
app.delete('/delete-clubParticipation-ajax/', function(req,res,next){
    let data = req.body;
    let clubParticipationId = parseInt(data.id);
    let delete_ClubParticipation = `DELETE FROM Club_Participation WHERE clubParticipationId = ?`;
  
        // Run the 1st query
        db.pool.query(delete_ClubParticipation, [clubParticipationId], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
            res.sendStatus(204);
            } 
        })
  });


// Citation for the following app.post function 
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
app.put('/put-clubParticipation-ajax', function(req,res,next){
let data = req.body;

let clubId = parseInt(data.clubId);
let clubParticipationId = parseInt(data.clubParticipationId);

let queryUpdateClubParticipation = `UPDATE Club_Participation SET clubId = ? WHERE clubParticipationId = ?`;
let selectClubParticipationEntry = `SELECT * FROM Club_Participation WHERE clubParticipationId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateClubParticipation, [clubId, clubParticipationId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectClubParticipationEntry, [clubParticipationId], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


/*
    LISTENER
*/
app.listen(PORT, function(){      
    console.log('Express started on http://localhost:' + PORT);
});