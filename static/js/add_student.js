/*
Modal Code was apated from a similar modal code in our CS 290 final project 
Date: 3/13/2025 
Adapted from My CS290 final project code which was adapted from the given Rob Hess code 
Source URL: https://github.com/osu-cs290-f24/handlebars-templating
*/

//show the add club Particpation modal when clicked
function showModal(event) {
    var modal = document.getElementById("add-student-modal")
    var backdrop = document.getElementById("add-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//get the button from club Particpation page
var addStudentButton = document.getElementById("add-student-button")
addStudentButton.addEventListener("click", showModal)


//close the add club Particpation modal when X or cancel clicked
function closeModal(event) {
    var modal = document.getElementById("add-student-modal")
    var backdrop = document.getElementById("add-modal-backdrop") 
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")
}

//get the X from modal 
var closeX = document.getElementById("add-modal-close")
closeX.addEventListener("click", closeModal)

// Citation for the following code in this file
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudentFName = document.getElementById("input-studentFName");
    let inputStudentLName = document.getElementById("input-studentLName");
    let inputStudentEmail = document.getElementById("input-studentEmail");
    let inputStudentMajor = document.getElementById("input-studentMajor");
    let inputStudentGrade = document.getElementById("input-studentGrade");

    // Get the values from the form fields
    let studentFNameValue = inputStudentFName.value;
    let studentLNameValue = inputStudentLName.value;
    let studentEmailValue = inputStudentEmail.value;
    let studentMajorValue = inputStudentMajor.value;
    let studentGradeValue = inputStudentGrade.value;

    // Put our data we want to send in a javascript object
    let data = {
        studentFName: studentFNameValue,
        studentLName: studentLNameValue,
        studentEmail: studentEmailValue,
        studentMajor: studentMajorValue,
        studentGrade: studentGradeValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) { 

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStudentFName.value = '';
            inputStudentLName.value = '';
            inputStudentEmail.value = '';
            inputStudentMajor.value = '';
            inputStudentGrade.value = '';

            // Close the modal automatically after pressing submit
            closeModal();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) { 
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Club_Participation
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("student-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    console.log(newRowIndex);

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let studentIdCell = document.createElement("TD");
    let studentFNameCell = document.createElement("TD");
    let studentLNameCell = document.createElement("TD");
    let studentEmailCell = document.createElement("TD");
    let studentMajorCell = document.createElement("TD");
    let studentGradeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    let updateCell = document.createElement("TD");

    // Fill the cells with correct data
    studentIdCell.innerText = newRow.studentId;
    studentFNameCell.innerText = newRow.studentFName;
    studentLNameCell.innerText = newRow.studentLName;
    studentEmailCell.innerText = newRow.studentEmail;
    studentMajorCell.innerText = newRow.studentMajor;
    studentGradeCell.innerText = newRow.studentGrade;

    // create delete button and add to delete Cell
    deleteCellButton = document.createElement("button");
    deleteCellButton.innerHTML = "Delete";
    deleteCellButton.onclick = function(){
        deleteStudent(newRow.studentId);
    };
    deleteCell.appendChild(deleteCellButton);

    // create update button and add to update Cell
    updateCellButton = document.createElement("button");
    updateCellButton.innerHTML = "Update";
    updateCellButton.onclick = function(){
        updateStudent(newRow.studentId);
    };
    updateCell.appendChild(updateCellButton);


    // Add the cells to the row 
    row.appendChild(studentIdCell);
    row.appendChild(studentFNameCell);
    row.appendChild(studentLNameCell);
    row.appendChild(studentEmailCell);
    row.appendChild(studentMajorCell);
    row.appendChild(studentGradeCell);

    row.appendChild(deleteCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.studentId);
    
    // Add the row to the table
    currentTable.appendChild(row);
}