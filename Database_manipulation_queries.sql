-- SEARCH QUERIES ------------------------------------------------------------------------

-- get all of the studetns in a given club
SELECT s.studentId, s.studentFName, s.studentLName
FROM Students s
JOIN Club_Participation cp ON s.studentId = cp.studentId
WHERE cp.clubId = :clubId_from_dropdown_Input;

-- list the events of a given club
SELECT e.eventId, e.eventName, e.eventDateTime, e.eventDescription
FROM Events e
WHERE e.clubId = :clubId_from_dropdown_Input;

-- list all clubs and their categories
SELECT c.clubId, c.clubName, cat.categoryName
FROM Clubs c
JOIN Categories cat ON c.clubCategory = cat.categoryId;

-- list all students and the clubs they are in
SELECT s.studentId, s.studentFName, s.studentLName, c.clubId, c.clubName
FROM Students s
JOIN Club_Participation cp ON s.studentId = cp.studentId
JOIN Clubs c ON cp.clubId = c.clubId;

-- list all students in a given club
SELECT s.studentId, s.studentFName, s.studentLName, s.studentEmail, s.studentMajor, s.studentGrade
FROM Students s
JOIN Club_Participation cp ON s.studentId = cp.studentId
WHERE cp.clubId = :clubId_from_dropdown_Input;

-- list all clubs in a given category
SELECT c.clubId, c.clubName
FROM Clubs c
JOIN Categories cat ON c.clubCategory = cat.categoryId
WHERE cat.categoryId = :categoryId_from_dropdown_Input;

-- get club name based on id
SELECT clubName 
FROM Clubs
WHERE clubId = :clubId_requested;

-- get student name based on id
SELECT s.studentFName, s.studentLName
FROM Students
WHERE studentId = :studentId_requested;

-- get event name based on id
SELECT eventName
FROM Events
WHERE eventId = :eventId_requested;

-- get category name based on id
SELECT categoryName
FROM Categories
WHERE categoryId = :categoryId_requested;

-- get student name and club name based on participation id
SELECT s.studentFName, s.studentLName, c.clubName
FROM Club_Participation cp
JOIN Students s ON cp.studentId = s.studentId
JOIN Clubs c ON cp.clubId = c.clubId
WHERE cp.clubParticipationId = :clubParticipationId_from_dropdown_Input;

-- STUDENTS ------------------------------------------------------------------------------

-- new student
INSERT INTO Students (studentFName, studentLName, studentEmail, studentMajor, studentGrade) VALUES
(:sFNameInput, :sLNameInput, :sEmailInput, :sMajorInput, sGradeInput)


-- update student
UPDATE Students 
SET studentFName = :sFNameInput, 
    studentLName = :sLNameInput,
    studentEmail = :sEmailInput, 
    studentMajor = :sMajorInput, 
    studentGrade = :sGradeInput
WHERE studentId = :studentId_from_update_form;

-- delete student
DELETE FROM Students 
WHERE studentId = :studentId_from_dropdown_Input;

-- CLUBS ----------------------------------------------------------------------------

-- new club
INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubPresident, clubCategory) VALUES
(:cNameInput, :cDescriptionInput, :cBudgetInput, :cPresidentIdInput, :cCategoryIdInput);


-- update club
UPDATE Clubs 
SET clubName = :cNameInput,  
    clubDescription = :cDescriptionInput, 
    clubBudget = :cBudgetInput, 
    clubPresident = :cPresidentIdInput, 
    clubCategory = :cCategoryIdInput
WHERE clubId = :clubId_from_update_form;

-- delete club
DELETE FROM Clubs 
WHERE clubId = :clubId_from_dropdown_Input;

-- CLUB PARTICIPATION ---------------------------------------------------------------------

-- new student-club association
INSERT INTO Club_Participation (clubId, studentId) VALUES
(:clubId_from_dropdown_Input, :studentId_from_dropdown_Input)

-- remove student-club association
DELETE FROM Club_Participation 
WHERE clubParticipationId = :clubParticipationId_from_dropdown_Input;

-- EVENTS -----------------------------------------------------------------------------------

-- new event
INSERT INTO Events (clubId, eventName, eventDateTime, eventDescription) VALUES
(:clubId_from_dropdown_Input, :eNameInput, :eDateTimeInput, :eDescriptionInput);


-- update event
UPDATE Events 
SET clubId = :clubId_from_dropdown_Input, 
    eventName = :eNameInput, 
    eventDateTime = :eDateTimeInput, 
    eventDescription = :eDescriptionInput
WHERE eventId = :eventId_from_update_form;

-- delete event
DELETE FROM Events 
WHERE eventId = :eventId_from_dropdown_Input;

-- CATEGORIES ------------------------------------------------------------------------

-- new category
INSERT INTO Categories (categoryName, categoryDescription) VALUES
(:catNameInput, :catDescriptionInput);


-- update category
UPDATE Categories 
SET categoryName = :catNameInput, 
    categoryDescription = :catDescriptionInput
WHERE categoryId = :categoryId_from_update_form; 

-- delete category
DELETE FROM Categories 
WHERE categoryId = :categoryId_from_dropdown_Input;
