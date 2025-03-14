// Citation for the following lines 4-29
// Date: 3/14/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var exphbs = require('express-handlebars');
PORT        = 7513;                 // Set a port number at the top so it's easy to change in the future

// handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.json()) 
app.use(express.urlencoded({extended: true})) 
app.use(express.static("static"))


// Database
var db = require('./database/db-connector')

// Home Page
app.get('/', function(req, res) {
    res.render('homePage');
});


// Citation for the following function app.get function (specifically the query parts)
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
// **********************************************************Clubs Page ************************************************************
app.get('/Clubs', function(req, res) {
    //query to get all Clubs, and join students and categories on clubs to get the clubPresident and clubCategory Id's
    let query1 = `SELECT Clubs.clubId, Clubs.clubName, Clubs.clubDescription, Clubs.clubBudget, Clubs.clubPresident AS clubPresidentId, Clubs.clubCategory AS clubCategoryId,
                        CONCAT(Students.studentFName, ' ', Students.studentLName) AS clubPresident, Categories.categoryName AS clubCategory 
                        FROM Clubs 
                        LEFT JOIN Students ON Clubs.clubPresident = Students.studentId 
                        LEFT JOIN Categories ON Clubs.clubCategory = Categories.categoryId`;

    let query2 = `SELECT * FROM Categories`;

    let query3 = `SELECT * FROM Students`;

    // if a search is present, add a where clause to query 1 so that the search will be limited to only matching rows
    if (req.query.clubName) {
    query1 += ` WHERE Clubs.clubName LIKE "${req.query.clubName}%"`;
    } 
    else if (req.query.clubBudget) {
        query1 += ` WHERE Clubs.clubBudget LIKE "${req.query.clubBudget}%"`;
    } 
    else if (req.query.clubCategory) {
        query1 += ` WHERE Clubs.clubCategory LIKE "${req.query.clubCategory}%"`;
    }


    db.pool.query(query1, function(error, rows, fields){ // Execute query
        // save the club entries
        let clubs = rows;

        db.pool.query(query2, function(error, rows, fields) {
            // save the category entries
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

    let query1;
    
    // Capture NULL values and create the insert query
    if (data.clubPresident === '' || data.clubPresident === "None" && data.clubCategory === '' || data.clubCategory === "None") {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget})`;
    } else if (data.clubPresident === '' || data.clubPresident === "None") {
        query1 = `INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubCategory) VALUES ("${data.clubName}", "${data.clubDescription}", ${data.clubBudget}, ${data.clubCategory})`;
    } else if (data.clubCategory === '' || data.clubCategory === "None") {
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
            // If there was no error, perform a SELECT * on Clubs (But join with names so that the club president's name is shown instead of the id and same with category)
            let query2 = `SELECT Clubs.clubId, Clubs.clubName, Clubs.clubDescription, Clubs.clubBudget, Clubs.clubPresident AS clubPresidentId, Clubs.clubCategory AS clubCategoryId,
                        CONCAT(Students.studentFName, ' ', Students.studentLName) AS clubPresident, Categories.categoryName AS clubCategory 
                        FROM Clubs 
                        LEFT JOIN Students ON Clubs.clubPresident = Students.studentId 
                        LEFT JOIN Categories ON Clubs.clubCategory = Categories.categoryId`;
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

    // parse the data and store it in the respective variables
    let clubId = data.clubId;
    let clubName = data.clubName; 
    let clubDescription = data.clubDescription;
    let clubBudget = parseInt(data.clubBudget);
    let clubPresident = data.clubPresident; 
    let clubCategory = data.clubCategory; 

    let queryUpdateClub;

    // select the club entry based on the matching clubId
    let selectClubEntry = `SELECT Clubs.clubId, Clubs.clubName, Clubs.clubDescription, Clubs.clubBudget, Clubs.clubPresident AS clubPresidentId, Clubs.clubCategory AS clubCategoryId,
                        CONCAT(Students.studentFName, ' ', Students.studentLName) AS clubPresident, Categories.categoryName AS clubCategory 
                        FROM Clubs 
                        LEFT JOIN Students ON Clubs.clubPresident = Students.studentId 
                        LEFT JOIN Categories ON Clubs.clubCategory = Categories.categoryId 
                        WHERE Clubs.clubId = ?`;


    // Capture NULL values and create the query
    if (data.clubPresident === "None" || data.clubPresident === ''){
        clubPresident = null;
    }
    if (data.clubCategory === "None" || data.clubCategory === ''){
        clubCategory = null;
    }
   
    queryUpdateClub = `UPDATE Clubs SET clubName = ?, clubDescription = ?, clubBudget = ? , clubPresident = ?, clubCategory = ? WHERE clubId = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateClub, [clubName, clubDescription, clubBudget, clubPresident, clubCategory, clubId], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the clubs table on the front-end
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
});
// **********************************************************Clubs Page************************************************************


// **********************************************************Students Page ************************************************************
app.get('/Students', function(req, res) {
    // get all students with their studentId, studentFName, studentLName, studentEmail, studentMajor, and studentGrade
    let query1 = `SELECT Students.studentId, Students.studentFName, Students.studentLName, Students.studentEmail, Students.studentMajor,
                  Students.studentGrade
                  FROM Students`;

    // if a search is present, add a where clause to query 1 so that the search will be limited by the respective search parameter
    if (req.query.studentFName) {
    query1 += ` WHERE Students.studentFName LIKE "${req.query.studentFName}%"`;
    } 
    else if (req.query.studentLName) {
        query1 += ` WHERE Students.studentLName LIKE "${req.query.studentLName}%"`;
    } 
    else if (req.query.studentMajor) {
        query1 += ` WHERE Students.studentMajor LIKE "${req.query.studentMajor}%"`;
    } 
    else if (req.query.studentGrade) {
        query1 += ` WHERE Students.studentGrade LIKE "${req.query.studentGrade}%"`;
    } 


    db.pool.query(query1, function(error, rows, fields){ // Execute query
        // get all students
        let students = rows;
        return res.render('students', {data:students}); 
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

    // Create query to insert a new student into the students table
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
            query2 = `SELECT * FROM Students`;
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
  
        // Run the delete student query
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

    // parse data and store it in corresponding attributes
    let studentFName = data.studentFName; 
    let studentLName = data.studentLName; 
    let studentEmail = data.studentEmail; 
    let studentMajor = data.studentMajor; 
    let studentGrade = data.studentGrade; 
    let studentId = parseInt(data.studentId);

    let queryUpdateStudent = `UPDATE Students SET studentFName = ?, studentLName = ?, studentEmail = ?, studentMajor = ?, studentGrade = ? WHERE studentId = ?`;
    let selectStudentEntry = `SELECT * FROM Students WHERE studentId = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateStudent, [studentFName, studentLName, studentEmail, studentMajor, studentGrade, studentId], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the people's table on the front-end
            else
            {
                // Run the second query to select a specific student based on studentId
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
    } 
    else if (searchColumn === "categoryName" || searchColumn === "categorySize") {
        query1 = `SELECT * FROM CategoryClubSize WHERE ${searchColumn} LIKE '%${searchTerm}%'`;
    } 
    else {
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

    let query1; // query for inserting new category into categories table

    // Create the insert query with given data 
    if(data.categoryDescription === '') { // allow categoryDescription to be NULL
        query1 = `INSERT INTO Categories (categoryName, categorySize) VALUES ("${data.categoryName}", 0)`;
    }else {
        query1 = `INSERT INTO Categories (categoryName, categorySize, categoryDescription) VALUES ("${data.categoryName}", 0, "${data.categoryDescription}")`;
    }
    
    // execute query
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Cagetories
            let query2 = `SELECT * FROM Categories`;
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

    // parse data and store attributes in variables
    let categoryName = data.categoryName; 
    let categoryDescription = data.categoryDescription; 
    let categoryId = parseInt(data.categoryId);

    // update category with new attributes
    let queryUpdateCategory = `UPDATE Categories SET categoryName = ?, categoryDescription = ? WHERE categoryId = ?`;
    let selectCategoryEntry = `SELECT * FROM Categories WHERE categoryId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateCategory, [categoryName, categoryDescription, categoryId], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the category table on the front-end
            else
            {
                // Run the second query to select a category by its id
                db.pool.query(selectCategoryEntry, [categoryId], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } 
                    else {
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
    let searchDate = req.query.searchDate; // Get date input

    if ((!searchTerm && !searchDate) || searchColumn === "none") {
        query1 = "SELECT * FROM Events"; // Fetch all events
    } else if (searchColumn === "eventName" || searchColumn === "eventLocation") {
        query1 = `SELECT * FROM Events WHERE ${searchColumn} LIKE '%${searchTerm}%'`;
    } else if (searchColumn === "eventDate" && searchDate) {
        query1 = `SELECT * FROM Events WHERE DATE(eventDateTime) = '${searchDate}'`; // Extract date from DATETIME
    } else {
        query1 = "SELECT * FROM Events"; // Fallback query
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

    // Create the query to insert into events based on the given data
    if(data.eventDescription === '') { // allow eventDescription to be NULL
        query1 = `INSERT INTO Events (eventName, eventDateTime, eventLocation, clubId) VALUES ("${data.eventName}", "${data.eventDateTime}", "${data.eventLocation}", "${data.clubId}")`;
    }else {
        query1 = `INSERT INTO Events (eventName, eventDescription, eventDateTime, eventLocation, clubId) VALUES ("${data.eventName}", "${data.eventDescription}", "${data.eventDateTime}", "${data.eventLocation}", "${data.clubId}")`;
    }
    
    // run the query on the database
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
            let query2 = `SELECT * FROM Events`;
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
  
        // Run the query to delete an event
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

    // parse data and store attributes into corresponding variables
    let eventName = data.eventName; 
    let eventDescription = data.eventDescription; 
    let eventDateTime = data.eventDateTime; 
    let eventLocation = data.eventLocation;
    let clubId = data.clubId; 
    let eventId = parseInt(data.eventId);

    // create queries to update events with given data, and select an event based on the give id
    let queryUpdateEvent = `UPDATE Events SET eventName = ?, eventDescription = ?, eventDateTime = ?, eventLocation = ?, clubId = ? WHERE eventId = ?`;
    let selectEventEntry = `SELECT * FROM Events WHERE eventId = ?`

        // Run the 1st query
        db.pool.query(queryUpdateEvent, [eventName, eventDescription, eventDateTime, eventLocation, clubId, eventId], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the events table on the front-end
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
    // query to get the clubParticipationId, clubName, studentFName, and studentLName from Club_Participation table
    let query1 = `SELECT Club_Participation.clubParticipationId, Clubs.clubName, Students.studentFName, Students.studentLName
        FROM Club_Participation
        INNER JOIN Clubs ON Club_Participation.clubId = Clubs.clubId
        INNER JOIN Students ON Club_Participation.studentId = Students.studentId`;      // Will get club_participation, and student/club names to display in table

    // querys to select everything from Clubs and Students
    let query2 = `SELECT * FROM Clubs`;
    let query3 = `SELECT * FROM Students`;

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

    // Execute querys on database
    db.pool.query(query1, function(error, rows, fields){
        // save the club_participation entries
        let club_particpations = rows

        db.pool.query(query2, function(error, rows, fields) {
            // save the clubs entries
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

// parse data and store attributes in corresponding variables
let clubParticipationId = parseInt(data.clubParticipationId);
let clubId = parseInt(data.clubId);
let studentId = parseInt(data.studentId);

// create queries for updating club participation and selecting a club participation based on id
let queryUpdateClubParticipation = `UPDATE Club_Participation SET clubId = ?, studentId = ? WHERE clubParticipationId = ?`;
// select Club Participation entry and get the student and club using Inner join on the respective tables
let selectClubParticipationEntry = `SELECT Club_Participation.clubParticipationId, Clubs.clubName, 
                                    Students.studentFName, Students.studentLName 
                                    FROM Club_Participation 
                                    INNER JOIN Clubs ON Club_Participation.clubId = Clubs.clubId
                                    INNER JOIN Students ON Club_Participation.studentId = Students.studentId
                                    WHERE clubParticipationId = ?`;
        // Run the 1st query
        db.pool.query(queryUpdateClubParticipation, [clubId, studentId, clubParticipationId], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the club Participation table on the front-end
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

app.listen(PORT, function(){      
    console.log('Express started on http://localhost:' + PORT);
});