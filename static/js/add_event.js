/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE ADD Event MODAL

//show the add event modal when clicked
function showAddModal(event) {
    var modal = document.getElementById("add-event-modal")
    var backdrop = document.getElementById("add-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//get the button from event page
var addEventButton = document.getElementById("add-event-button")
addEventButton.addEventListener("click", showAddModal)


//close the add event modal when X or cancel clicked
function closeAddModal(event) {
    var modal = document.getElementById("add-event-modal")
    var backdrop = document.getElementById("add-modal-backdrop") 
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")
}

//get the X from modal 
var closeX = document.getElementById("add-modal-close")
closeX.addEventListener("click", closeAddModal)
//////////////////////////////////////////////////////////////////////////


// Citation for the following code in this file
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addEventForm = document.getElementById('add-event-form-ajax');

// Modify the objects we need
addEventForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEventName = document.getElementById("input-eventName");
    let inputEventDescription = document.getElementById("input-eventDescription");
    let inputEventDateTime = document.getElementById("input-eventDateTime");
    let inputEventLocation = document.getElementById("input-eventLocation");
    let inputClubId = document.getElementById("input-clubId");

    // Get the values from the form fields
    let eventNameValue = inputEventName.value;
    let eventDescriptionValue = inputEventDescription.value;
    let eventDateTimeValue = inputEventDateTime.value;
    let eventLocationValue = inputEventLocation.value;
    let clubIdValue = inputClubId.value;

    // Put our data we want to send in a javascript object
    let data = {
        eventName: eventNameValue,
        eventDescription: eventDescriptionValue,
        eventDateTime: eventDateTimeValue,
        eventLocation: eventLocationValue,
        clubId: clubIdValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-event-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) { // maybe want to update to 2 (not sure what readyState does yet)

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputEventName.value = '';
            inputEventDescription.value = '';
            inputEventDateTime.value = '';
            inputEventLocation.value = '';
            inputClubId.value = '';

            // Close the modal automatically after pressing submit
            closeAddModal();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) { // maybe want to update to 2 (not sure what readyState does yet)
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Events
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("event-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    console.log(newRowIndex);

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let eventIdCell = document.createElement("TD");
    let clubIdCell = document.createElement("TD");
    let eventNameCell = document.createElement("TD");
    let eventDateTimeCell = document.createElement("TD");
    let eventLocationCell = document.createElement("TD");
    let eventDescriptionCell = document.createElement("TD");



    let deleteCell = document.createElement("TD");
    let updateCell = document.createElement("TD");

    // Fill the cells with correct data
    eventIdCell.innerText = newRow.eventId; // Should set the eventId automatically to the next val (auto-incrementing)
    eventNameCell.innerText = newRow.eventName;
    eventDescriptionCell.innerText = newRow.eventDescription;
    eventDateTimeCell.innerText = newRow.eventDateTime;
    eventLocationCell.innerText = newRow.eventLocation;
    clubIdCell.innerText = newRow.clubId;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteEvent(newRow.eventId);
    };
    deleteCell.appendChild(deleteButton);

    updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.onclick = function(){
        updateEvent(newRow.eventId);
    };
    updateCell.appendChild(updateButton);

    // Add the cells to the row 
    row.appendChild(eventIdCell);
    row.appendChild(clubIdCell);
    row.appendChild(eventNameCell);
    row.appendChild(eventDateTimeCell);
    row.appendChild(eventLocationCell);
    row.appendChild(eventDescriptionCell);


    row.appendChild(deleteCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.eventId);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // May want to fix this below

    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    // let selectMenu = document.getElementById("mySelect");
    // let option = document.createElement("option");
    // option.text = newRow.clubId;
    // option.value = newRow.clubId; // maybe want just newRow.id
    // selectMenu.add(option);
}
