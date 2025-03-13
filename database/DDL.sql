-- CS 340
-- Group 72
-- Project Step 4 Draft
-- Kellen Sullivan, Kaden Allen

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop all tables if they exists
DROP TABLE IF EXISTS Students, Categories, Clubs, Club_Participation, Events;
DROP VIEW IF EXISTS CategoryClubSize;

-- Create Students table
CREATE TABLE Students (
    studentId int AUTO_INCREMENT UNIQUE NOT NULL,
    studentFName varchar(50) NOT NULL,
    studentLName varchar(50) NOT NULL,
    studentEmail varchar(50) NOT NULL,
    studentMajor varchar(50) NOT NULL,
    studentGrade varchar(16) NOT NULL,
    PRIMARY KEY (studentId)
);

-- Create Categories table
CREATE TABLE Categories (
    categoryId int AUTO_INCREMENT UNIQUE NOT NULL,
    categoryName varchar(32) UNIQUE NOT NULL,
    categorySize int NOT NULL,
    categoryDescription varchar(256),
    PRIMARY KEY (categoryId)
);

-- Create Clubs table
CREATE TABLE Clubs (
    clubId int AUTO_INCREMENT UNIQUE NOT NULL,
    clubName varchar(64) NOT NULL,
    clubDescription varchar(256),
    clubBudget int NOT NULL,
    clubPresident int NULL, -- The id of the student that is the president of the club (not required)
    clubCategory int NULL, -- The id of the category that the club is in (not required)
    FOREIGN KEY (clubCategory) REFERENCES Categories(categoryId) ON DELETE SET NULL, -- If the category is deleted, the value is set to null
    FOREIGN KEY (clubPresident) REFERENCES Students(studentId) ON DELETE SET NULL, -- If the president is deleted, the value is set to null 
    PRIMARY KEY (clubId)
);

-- Create Club_Participation table
CREATE TABLE Club_Participation (
    clubParticipationId int AUTO_INCREMENT UNIQUE NOT NULL,
    clubId int NOT NULL, -- The club in the relationship
    studentId int NOT NULL, -- the student in the relationship
    PRIMARY KEY (clubParticipationId),
    FOREIGN KEY (clubId) REFERENCES Clubs(clubId) ON DELETE CASCADE, 
    FOREIGN KEY (studentId) REFERENCES Students(studentId) ON DELETE CASCADE
);

-- Create Events Table
CREATE TABLE Events (
    eventId int AUTO_INCREMENT UNIQUE NOT NULL,
    clubId int NOT NULL, -- The id of the club hosting the event
    eventName varchar(50) NOT NULL,
    eventDateTime datetime NOT NULL,
    eventDescription varchar(256),
    eventLocation varchar(256),
    PRIMARY KEY (eventId),
    FOREIGN KEY (clubId) REFERENCES Clubs(clubId) ON DELETE CASCADE -- If a club is deleted, its events are too
);

CREATE VIEW CategoryClubSize AS
SELECT c.categoryId, 
       c.categoryName, 
       COUNT(cl.clubId) AS categorySize,
       c.categoryDescription
FROM Categories c
LEFT JOIN Clubs cl ON c.categoryId = cl.clubCategory
GROUP BY c.categoryId;


-- Insert data into all tables

INSERT INTO Categories (categoryName, categorySize, categoryDescription) 
VALUES
("Recreation", 0, "Clubs not related to professional majors"),
("Business", 0, "Clubs related to aspects of the business industry. They may teach business related topics, or be overseen by a business professor."),
("Sports", 0, "Clubs that participate in sports, whether competitively or recreationally."),
("Math", 0,"Clubs related to the field of mathematics.");

INSERT INTO Clubs (clubName, clubDescription, clubBudget, clubPresident, clubCategory)
VALUES 
("Chess Club", "Open to all experience levels, come learn, practice, and play chess with friends!", 250, 10, (SELECT categoryId FROM Categories WHERE categoryName = "Recreation")),
("Bake Sale Club", "Bake fresh goods, and raise money for good causes!", 500, 7, NULL),
("Lacrosse Club", "Fictus University's premier lacrosse club, we travel and compete against other schools.", 1000, 12, (SELECT categoryId FROM Categories WHERE categoryName = "Sports")),
("Math Club", "Learn exciting new math concepts, compete in fun games, and even win prizes!", 100, 5, (SELECT categoryId FROM Categories WHERE categoryName = "Math"));

INSERT INTO Students (studentFName, studentLName, studentEmail, studentMajor, studentGrade)
VALUES 
("Jason", "Mann", "mannj@fu.edu", "Math", "Junior"),
("Chole", "Sullivan", "sullivc@fu.edu", "Finance", "Sophomore"),
("Kelly", "Allen", "allenk@fu.edu", "Business", "Junior"),
("Justin", "Scott", "scottj@fu.edu", "Math", "Senior");

INSERT INTO Events (clubId, eventName, eventDateTime, eventDescription, eventLocation)
VALUES
((SELECT clubId FROM Clubs WHERE clubName = "Chess Club"), "Weekly Meeting", "2025-02-04 18:00:00", "This is the weekly meeting time for chess club. We will play games and eat pizza!", "Room 304"),
((SELECT clubId FROM Clubs WHERE clubName = "Chess Club"), "Weekend Chess Tournament", "2025-02-02 10:00:00", "This event is a weekend chess tournament put on with clubs from other schools.", "Event Hall"),
((SELECT clubId FROM Clubs WHERE clubName = "Bake Sale Club"), "Sunday Sale", "2025-02-02 14:00:00", "Bake sale to raise money for unemployed cs graduates.", "MU"),
((SELECT clubId FROM Clubs WHERE clubName = "Lacrosse Club"), "Monday Practice", "2025-02-03 18:00:00", "Monday Lacrosse Practice for the varsity team.", "IM Field");



INSERT INTO Club_Participation (clubId, studentId)
VALUES
((SELECT clubId FROM Clubs WHERE clubName = "Chess Club"), (SELECT studentId FROM Students WHERE studentFName = "Jason" AND studentLName = "Mann")),
((SELECT clubId FROM Clubs WHERE clubName = "Bake Sale Club"), (SELECT studentId FROM Students WHERE studentFName = "Chole" AND studentLName = "Sullivan")),
((SELECT clubId FROM Clubs WHERE clubName = "Lacrosse Club"), (SELECT studentId FROM Students WHERE studentFName = "Kelly" AND studentLName = "Allen")),
((SELECT clubId FROM Clubs WHERE clubName = "Math Club"), (SELECT studentId FROM Students WHERE studentFName = "Justin" AND studentLName = "Scott"));


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
