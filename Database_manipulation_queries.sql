-- SEARCH QUERIES ------------------------------------------------------------------------

-- get all of the studetns in a given club
SELECT s.studentId, s.studentName 
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
SELECT s.studentId, s.studentName, c.clubId, c.clubName
FROM Students s
JOIN Club_Participation cp ON s.studentId = cp.studentId
JOIN Clubs c ON cp.clubId = c.clubId;

-- list all students in a given club
SELECT s.studentId, s.studentName, s.studentEmail, s.studentMajor, s.studentGrade
FROM Students s
JOIN Club_Participation cp ON s.studentId = cp.studentId
WHERE cp.clubId = :clubId_from_dropdown_Input;

-- list all clubs in a given category
SELECT c.clubId, c.clubName
FROM Clubs c
JOIN Categories cat ON c.clubCategory = cat.categoryId
WHERE cat.categoryId = :categoryId_from_dropdown_Input;

-- STUDENTS ------------------------------------------------------------------------------

-- new student
INSERT INTO Students (studentName, studentEmail, studentMajor, studentGrade) VALUES
(:sNameInput, :sEmailInput, :sMajorInput, sGradeInput)


-- update student
UPDATE Students 
SET studentName = :sNameInput, 
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
WHERE clubId = :clubId_from_dropdown_Input AND studentId = :studentId_from_dropdown_Input;

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
