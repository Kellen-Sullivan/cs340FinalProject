/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE ADD Club Particpation MODAL

//show the add club Particpation modal when clicked
function showModal(event) {
    var modal = document.getElementById("add-clubParticipation-modal")
    var backdrop = document.getElementById("add-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//get the button from club Particpation page
var addClubParticipationButton = document.getElementById("add-clubParticipation-button")
addClubParticipationButton.addEventListener("click", showModal)


//close the add club Particpation modal when X or cancel clicked
function closeModal(event) {
    var modal = document.getElementById("add-clubParticipation-modal")
    var backdrop = document.getElementById("add-modal-backdrop") 
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")
}

//get the X from modal 
var closeX = document.getElementById("add-modal-close")
closeX.addEventListener("click", closeModal)
//////////////////////////////////////////////////////////////////////////


// Citation for the following code in this file
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addclubParticipationForm = document.getElementById('add-clubParticipation-form-ajax');

// Modify the objects we need
addclubParticipationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClubId = document.getElementById("input-clubId");
    let inputStudentId = document.getElementById("input-studentId");

    // Get the values from the form fields
    let clubIdValue = inputClubId.value;
    let studentIdValue = inputStudentId.value;

    // Put our data we want to send in a javascript object
    let data = {
        clubId: clubIdValue,
        studentId: studentIdValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-clubParticipation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) { // maybe want to update to 2 (not sure what readyState does yet)

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputClubId.value = '';
            inputStudentId.value = '';

            // Close the modal automatically after pressing submit
            closeModal();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) { // maybe want to update to 2 (not sure what readyState does yet)
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Club_Participation
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("clubParticipation-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    console.log(newRowIndex);

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let clubParticipationIdCell = document.createElement("TD");
    let clubIdCell = document.createElement("TD");
    let studentIdCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    let updateCell = document.createElement("TD");

    // Fill the cells with correct data
    clubParticipationIdCell.innerText = newRow.clubParticipationId; // Should set the clubParticipationId automatically to the next val (auto-incrementing)
    clubIdCell.innerText = newRow.clubId;
    studentIdCell.innerText = newRow.studentId;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteClubParticipation(newRow.clubParticipationId);
    };

    updateCell = document.createElement("button");
    updateCell.innerHTML = "Update";
    updateCell.onclick = function(){
        updateClubParticipation(newRow.clubParticipationId);
    };

    // Add the cells to the row 
    row.appendChild(clubParticipationIdCell);
    row.appendChild(clubIdCell);
    row.appendChild(studentIdCell);
    row.appendChild(deleteCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.clubParticipationId);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.clubParticipationId;
    option.value = newRow.clubParticipationId; // maybe want just newRow.id
    selectMenu.add(option);
}