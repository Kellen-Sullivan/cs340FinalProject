-- CS 340
-- Group 72
-- Project Step 2 Draft
-- Kellen Sullivan, Kaden Allen

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop all tables if they exists
DROP TABLE IF EXISTS Students, Categories, Clubs, Club_Participation, Events;

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
    clubSize int,
    clubDescription varchar(256),
    clubBudget int NOT NULL,
    clubPresident int,
    clubCategory int,
    FOREIGN KEY (clubCategory) REFERENCES Categories(categoryId) ON DELETE SET NULL,
    FOREIGN KEY (clubPresident) REFERENCES Students(studentId) ON DELETE SET NULL,
    PRIMARY KEY (clubId)
);

-- Create Club_Participation table
CREATE TABLE Club_Participation (
    clubParticipationId int AUTO_INCREMENT UNIQUE NOT NULL,
    clubId int NOT NULL,
    studentId int NOT NULL,
    FOREIGN KEY (clubId) REFERENCES Clubs(clubId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES Students(studentId) ON DELETE CASCADE,
);

-- Create Events Table
CREATE TABLE Events (
    eventId int AUTO_INCREMENT UNIQUE NOT NULL,
    clubId int NOT NULL,
    eventName varchar(50) NOT NULL,
    eventDateTime datetime NOT NULL,
    eventDescription varchar(256),
    PRIMARY KEY (eventId),
    FOREIGN KEY (clubId) REFERENCES Clubs(clubId) ON DELETE CASCADE
);


-- Insert data into all tables
INSERT INTO Clubs (clubId, clubName, clubDescription, clubBudget, clubPresident)
VALUES 
(1, "Chess Club", "Open to all experience levels, come learn, practice, and play chess with friends!", 250, 10),
(2, "Bake Sale Club", "Bake fresh goods, and raise money for good causes!", 500, 7),
(3, "Lacrosse Club", "Fictus University's premier lacrosse club, we travel and compete against other schools.", 1000, 12),
(4, "Math Club", "Learn exciting new math concepts, compete in fun games, and even win prizes!", 100, 5);

INSERT INTO Students (studentId, studentFName, studentLName, studentEmail, studentMajor, studentGrade)
VALUES 
(10, "Jason", "Mann", "mannj@fu.edu", "Math", "Junior"),
(7, "Chole", "Sullivan", "sullivc@fu.edu", "Finance", "Sophomore"),
(12, "Kelly", "Allen", "allenk@fu.edu", "Business", "Junior"),
(5, "Justin", "Scott", "scottj@fu.edu", "Math", "Senior");

INSERT INTO Events (clubId, eventId, eventName, eventDateTime, eventDescription)
VALUES
(1, 1, "Weekly Meeting", "2025-02-04 18:00:00", "This is the weekly meeting time for chess club. We will play games and eat pizza!"),
(1, 2, "Weekend Chess Tournament", "2025-02-02 10:00:00", "This event is a weekend chess tournament put on with clubs from other schools."),
(2, 3, "Sunday Sale", "2025-02-02 14:00:00", "Bake sale to raise money for unemployed cs graduates."),
(3, 4, "Monday Practice", "2025-02-03 18:00:00", "Monday Lacrosse Practice for the varsity team.");

INSERT INTO Categories (categoryId, categoryName, categorySize, categoryDescription) 
VALUES
(1, "Recreation", 15, "Clubs not related to professional majors"),
(2, "Business", 5, "Clubs related to aspects of the business industry. They may teach business related topics, or be overseen by a business professor."),
(3, "Sports", 12, "Clubs that participate in sports, whether competitively or recreationally."),
(4, "Math", 3, "Clubs related to the field of mathematics.");

INSERT INTO Club_Participation(clubId, studentId)
VALUES
(1,10),
(2,7),
(3,12),
(4,5);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
