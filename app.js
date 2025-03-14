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
// **********************************************************Clubs Page ************************************************************
app.get('/Clubs', function(req, res) {
    let query1;       // Will get clubs, dynamic based on search term

    let query2;

    let query3 = "SELECT * FROM Students"

    // // If there is no query string, we just perform a basic SELECT
    if (!req.query.categoryName)
    {
        query1 = "SELECT * FROM Clubs"
        query2 = "SELECT * FROM Categories"
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        // we joined Club_Participation.studentId with Students so that the user can search by student last name
        query1 = `SELECT Clubs.clubId, Clubs.clubName, Clubs.clubDescription, Clubs.clubBudget, Clubs.clubPresident, Clubs.clubCategory FROM Clubs 
                  INNER JOIN Categories ON Clubs.clubCategory = Categories.categoryName 
                  WHERE Categories.categoryName LIKE "${req.query.categoryName}%"`
        query2 = `SELECT * FROM Clubs WHERE categoryName LIKE "${req.query.categoryName}%"`
    } 

    db.pool.query(query1, function(error, rows, fields){ // Execute query
        // save the club_participation entries
        let clubs = rows

        db.pool.query(query2, function(error, rows, fields) {
            // save the student entries
            let categories = rows;

            db.pool.query(query3, function(error, rows, fields) {
                // save the student entries
                let students = rows;

                return res.render('clubs', {data:clubs, categories:categories, students:students});    // want to have third argument, students:students
            })
        })
    }) 
});

// Citation for the following app.post function 
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/add-club-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log(data)

    let query1;
    
    // Capture NULL values and create the query
    if (data.clubPresident === '' && data.clubCategory === '') {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget})`;
    } else if (data.clubPresident === '') {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubCategory) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget}, ${data.clubCategory})`;
    } else if (data.clubCategory === '') {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubPresident) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget}, ${data.clubPresident})`;
    } else {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubPresident, clubCategory) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget}, ${data.clubPresident}, ${data.clubCategory})`;
    }

    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Clubs
            query2 = `SELECT * FROM Clubs`;
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
app.delete('/delete-club-ajax/', function(req,res,next){
    let data = req.body;
    let clubId = parseInt(data.id);
    let delete_Club = `DELETE FROM Clubs WHERE clubId = ?`;
  
        // Run the 1st query
        db.pool.query(delete_Club, [clubId], function(error, rows, fields){
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
app.put('/put-club-ajax', function(req,res,next){
let data = req.body;

let clubId = data.clubId;
let clubName = data.clubName; // change to clubCategory (Probably want to add ability to update other fields)
let clubDescription = data.clubDescription;
let clubBudget = parseInt(data.clubBudget);
let clubPresident = parseInt(data.clubPresident);
let clubCategory = parseInt(data.clubCategory);

let queryUpdateClub;
let selectClubEntry = `SELECT * FROM Clubs WHERE clubId = ?`


// Capture NULL values and create the query
if (data.clubPresident === '' && data.clubCategory === '') {
    queryUpdateClub = `UPDATE Clubs SET clubName = ?, clubDescription = ?, clubBudget = ? WHERE clubId = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateClub, [clubName, clubDescription, clubBudget, clubId], function(error, rows, fields){
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
            db.pool.query(selectClubEntry, [clubId], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
} else if (data.clubPresident === '') {
    queryUpdateClub = `UPDATE Clubs SET clubName = ?, clubDescription = ?, clubBudget = ? , clubCategory = ? WHERE clubId = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateClub, [clubName, clubDescription, clubBudget, clubCategory, clubId], function(error, rows, fields){
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
            db.pool.query(selectClubEntry, [clubId], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })

} else if (data.clubCategory === '') {
    queryUpdateClub = `UPDATE Clubs SET clubName = ?, clubDescription = ?, clubBudget = ? , clubPresident = ? WHERE clubId = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateClub, [clubName, clubDescription, clubBudget, clubPresident, clubId], function(error, rows, fields){
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
            db.pool.query(selectClubEntry, [clubId], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })

} else {
    queryUpdateClub = `UPDATE Clubs SET clubName = ?, clubDescription = ?, clubBudget = ? , clubPresident = ?, clubCategory = ? WHERE clubId = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateClub, [clubName, clubDescription, clubBudget, clubPresident, clubCategory, clubId], function(error, rows, fields){
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
            db.pool.query(selectClubEntry, [clubId], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
    }
});


// **********************************************************Clubs Page************************************************************



// **********************************************************Students Page ************************************************************
app.get('/Students', function(req, res) {
    console.log("made it to students!");
    let query1;     

    // let query2;       // maybe search by year, or name

    // let query3;       // Will get students, dynamic based on search term

    // // // If there is no query string, we just perform a basic SELECT
    if (req.query.studentLName === undefined)
    {
        query1 = "SELECT * FROM Students"
    }

    // // If there is a query string, we assume this is a search, and return desired results
    else
    {
        // we joined Club_Participation.studentId with Students so that the user can search by student last name
        query1 = `SELECT * FROM Students WHERE Students.studentLName LIKE "${req.query.studentLName}%"`;
    } 

    db.pool.query(query1, function(error, rows, fields){ // Execute query
        // save the club_participation entries
        let students = rows

        // db.pool.query(query2, function(error, rows, fields) {
        //     // save the student entries
        //     let clubs = rows;

        //     db.pool.query(query3, function(error, rows, fields) {
        //         // save the student entries
        //         let students = rows;

                return res.render('students', {data:students});    // may need to fix this line
            })
});

// Citation for the following app.post function 
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/add-student-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    // All attributes in Club_Participation are non nullable, so nothing goes here

    // Create the query and run it on the database
    query1 = `INSERT INTO Students (studentFName, studentLName, studentEmail, studentMajor, studentGrade) VALUES ("${data.studentFName}", "${data.studentLName}", "${data.studentEmail}", "${data.studentMajor}", "${data.studentGrade}")`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Students
            query2 = `SELECT * FROM Students;`;
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
app.delete('/delete-student-ajax/', function(req,res,next){
    let data = req.body;
    let studentId = parseInt(data.id);
    let delete_Student = `DELETE FROM Students WHERE studentId = ?`;
  
        // Run the 1st query
        db.pool.query(delete_Student, [studentId], function(error, rows, fields){
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
app.put('/put-student-ajax', function(req,res,next){
let data = req.body;

let studentFName = data.studentFName; 
let studentLName = data.studentLName; 
let studentEmail = data.studentEmail; 
let studentMajor = data.studentMajor; 
let studentGrade = data.studentGrade; 
let studentId = parseInt(data.studentId);

let queryUpdateStudent = `UPDATE Students SET studentFName = ?, studentLName = ?, studentEmail = ?, studentMajor = ?, studentGrade = ? WHERE studentId = ?`;
let selectStudentEntry = `SELECT * FROM Students WHERE studentId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateStudent, [studentFName, studentLName, studentEmail, studentMajor, studentGrade, studentId], function(error, rows, fields){
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
                db.pool.query(selectStudentEntry, [studentId], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


// **********************************************************Students Page ************************************************************

// **********************************************************Categories Page **********************************************************

app.get('/Categories', function(req, res) {
    let query1; // Query to fetch categories

    // Determine the query for categories based on the presence of a search term
    let searchColumn = req.query.categorySearchChoice; // Get dropdown value
    let searchTerm = req.query.searchTerm; // Get search term

    if (!searchTerm || searchColumn === "none") {
        query1 = "SELECT * FROM CategoryClubSize"; // Fetch all categories
    } else if (searchColumn === "categoryName" || searchColumn === "categorySize") {
        query1 = `SELECT * FROM CategoryClubSize WHERE ${searchColumn} LIKE '%${searchTerm}%'`;
    } else {
        query1 = "SELECT * FROM CategoryClubSize"; // Fallback if an invalid column is selected
    }

    // Execute the first query to fetch cagetories
    db.pool.query(query1, function(error, categoryData, fields) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error fetching category data");
        }


        // Render the Handlebars template with category data
        res.render('categories', {
            data: categoryData, // Pass category data
        });
    });
});

// Citation for the following app.post function 
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/add-category-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1;
    // Capture NULL values
    // All attributes in Club_Participation are non nullable, so nothing goes here

    // Create the query and run it on the database
    if(data.categoryDescription === '') { // allow categoryDescription to be NULL
        query1 = `INSERT INTO Categories (categoryName, categorySize) VALUES ("${data.categoryName}", 0)`;
    }else {
        query1 = `INSERT INTO Categories (categoryName, categorySize, categoryDescription) VALUES ("${data.categoryName}", 0, "${data.categoryDescription}")`;
    }
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Cagetories
            query2 = `SELECT * FROM Categories;`;
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
app.delete('/delete-category-ajax/', function(req,res,next){
    let data = req.body;
    let categoryId = parseInt(data.id);
    let delete_Category = `DELETE FROM Categories WHERE categoryId = ?`;
  
        // Run the 1st query
        db.pool.query(delete_Category, [categoryId], function(error, rows, fields){
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
app.put('/put-category-ajax', function(req,res,next){
let data = req.body;

let categoryName = data.categoryName; 
let categoryDescription = data.categoryDescription; 
let categoryId = parseInt(data.categoryId);

let queryUpdateCategory = `UPDATE Categories SET categoryName = ?, categoryDescription = ? WHERE categoryId = ?`;
let selectCategoryEntry = `SELECT * FROM Categories WHERE categoryId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateCategory, [categoryName, categoryDescription, categoryId], function(error, rows, fields){
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
                db.pool.query(selectCategoryEntry, [categoryId], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


// **********************************************************Categories Page **********************************************************

// **********************************************************Events Page **************************************************************

app.get('/Events', function(req, res) {
    let query1; // Query to fetch events
    let query2 = "SELECT * FROM Clubs"; // Query to fetch clubs

    // Determine the query for events based on the presence of a search term
    let searchColumn = req.query.eventSearchChoice; // Get dropdown value
    let searchTerm = req.query.searchTerm; // Get search term

    if (!searchTerm || searchColumn === "none") {
        query1 = "SELECT * FROM Events"; // Fetch all events
    } else if (searchColumn === "eventName" || searchColumn === "eventLocation") {
        query1 = `SELECT * FROM Events WHERE ${searchColumn} LIKE '%${searchTerm}%'`;
    } else {
        query1 = "SELECT * FROM Events"; // Fallback if an invalid column is selected
    }

    // Execute the first query to fetch events
    db.pool.query(query1, function(error, eventsData, fields) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error fetching events data");
        }

        // Execute the second query to fetch clubs
        db.pool.query(query2, function(error, clubsData, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send("Error fetching clubs data");
            }


            // Render the Handlebars template with both events and clubs data
            res.render('events', {
                data: eventsData, // Pass events data
                clubs: clubsData // Pass clubs data
            });
        });
    });
});

// Citation for the following app.post function 
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/add-event-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1;
    // Capture NULL values
    // All attributes in Club_Participation are non nullable, so nothing goes here

    // Create the query and run it on the database
    if(data.eventDescription === '') { // allow eventDescription to be NULL
        query1 = `INSERT INTO Events (eventName, eventDateTime, eventLocation, clubId) VALUES ("${data.eventName}", "${data.eventDateTime}", "${data.eventLocation}", "${data.clubId}")`;
    }else {
        query1 = `INSERT INTO Events (eventName, eventDescription, eventDateTime, eventLocation, clubId) VALUES ("${data.eventName}", "${data.eventDescription}", "${data.eventDateTime}", "${data.eventLocation}", "${data.clubId}")`;
    }
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Events
            query2 = `SELECT * FROM Events;`;
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
app.delete('/delete-event-ajax/', function(req,res,next){
    let data = req.body;
    let eventId = parseInt(data.id);
    let delete_Event = `DELETE FROM Events WHERE eventId = ?`;
  
        // Run the 1st query
        db.pool.query(delete_Event, [eventId], function(error, rows, fields){
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
app.put('/put-event-ajax', function(req,res,next){
let data = req.body;

let eventName = data.eventName; 
let eventDescription = data.eventDescription; 
let eventDateTime = data.eventDateTime; 
let clubId = data.clubId; 
let eventId = parseInt(data.eventId);

let queryUpdateEvent = `UPDATE Events SET eventName = ?, eventDescription = ?, eventDateTime = ?, clubId = ? WHERE eventId = ?`;
let selectEventEntry = `SELECT * FROM Events WHERE eventId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateEvent, [eventName, eventDescription, eventDateTime, clubId, eventId], function(error, rows, fields){
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
                db.pool.query(selectEventEntry, [eventId], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


// **********************************************************Events Page **************************************************************


// **********************************************************Club_Participation Page ************************************************************
app.get('/ClubParticipation', function(req, res) {
    let query1 = `SELECT Club_Participation.clubParticipationId, Clubs.clubName, Students.studentFName, Students.studentLName
        FROM Club_Participation
        INNER JOIN Clubs ON Club_Participation.clubId = Clubs.clubId
        INNER JOIN Students ON Club_Participation.studentId = Students.studentId`      // Will get club_participation, and student/club names to display in table

   let query2 = `SELECT * FROM Clubs`
   let query3 = `SELECT * FROM Students`

   // if a search is present, add a where clause to query 1 so that the serach will be limited
   if (req.query.studentLName) {
    query1 += ` WHERE Students.studentLName LIKE "${req.query.studentLName}%"`
    } 
    else if (req.query.studentFName) {
        query1 += ` WHERE Students.studentFName LIKE "${req.query.studentFName}%"`
    } 
    else if (req.query.clubName) {
        query1 += ` WHERE Clubs.clubName LIKE "${req.query.clubName}%"`
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

                return res.render('clubParticipation', {data:club_particpations, clubs:clubs, students:students});   
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
    query1 = `INSERT INTO Club_Participation (clubId, studentId) VALUES (${data.clubId}, ${data.studentId})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // This query gets the names of the club and students based off of the ids from data
            query2 = `SELECT Club_Participation.clubParticipationId, Clubs.clubName, Students.studentFName, Students.studentLName
                      FROM Club_Participation
                      INNER JOIN Clubs ON Club_Participation.clubId = Clubs.clubId
                      INNER JOIN Students ON Club_Participation.studentId = Students.studentId`;

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
console.log(data)

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
// **********************************************************Club_Participation Page ************************************************************


/*
    LISTENER
*/
app.listen(PORT, function(){      
    console.log('Express started on http://localhost:' + PORT);
});