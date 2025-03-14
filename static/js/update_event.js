// declare global so that updateSubmitHandler can access this var
let globalEventId = -1;

/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE Update Event MODAL

//show the update event modal when clicked
function showUpdateModal(event) {
    var modal = document.getElementById("update-event-modal");
    var backdrop = document.getElementById("update-modal-backdrop");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
}

//close the add event modal when X or cancel clicked
function closeUpdateModal(event) {
    var modal = document.getElementById("update-event-modal");
    var backdrop = document.getElementById("update-modal-backdrop");
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
}

//get the X from modal 
var closeX = document.getElementById("update-modal-close")
closeX.addEventListener("click", closeUpdateModal)
//////////////////////////////////////////////////////////////////////////

// function to call update row with correct values when submit is pressed
function updateSubmitHandler(e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEventName = document.getElementById("update-input-eventName");
    let inputEventDescription = document.getElementById("update-input-eventDescription");
    let inputEventDateTime = document.getElementById("update-input-eventDateTime");
    let inputClubId = document.getElementById("update-input-clubId");

    // Get the values from the form fields
    let eventIdValue = globalEventId;
    let eventNameValue = inputEventName.value;
    let eventDescriptionValue = inputEventDescription.value;
    let eventDateTimeValue = inputEventDateTime.value;
    let clubIdValue = inputClubId.value;

    // Put our data we want to send in a javascript object
    let data = {
        eventId: eventIdValue,
        eventName: eventNameValue,
        eventDescription: eventDescriptionValue,
        eventDateTime: eventDateTimeValue,
        clubId: clubIdValue,
    }

    if (isNaN(eventIdValue)) // if both entries are empty return
    {
        return;
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-event-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, eventIdValue);
            // close the modal automatically after updating the row
            closeUpdateModal();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }
    console.log("sending!");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

}

// function to show the modal with the form inside and close the modal when the user clicks the x
function updateEvent(eventId) {
    // show modal and set up closeing button
    showUpdateModal();
    var closeX = document.getElementById("update-modal-close")
    closeX.addEventListener("click", closeUpdateModal)

    // update global var value
    globalEventId = eventId;

/*----------------------code for prepopulating all fields with current values----------------*/
    // Get the row for this clubId
    let row = document.querySelector(`tr[data-value="${eventId}"]`);
    let cells = row.getElementsByTagName('td');

    // Populate form fields with current values
    document.getElementById('update-input-eventName').value = cells[2].textContent; // eventName
    document.getElementById('update-input-eventDescription').value = cells[4].textContent; // eventDescription
    document.getElementById('update-input-eventLocation').value = cells[5].textContent; // eventLocation

    // Handle eventDateTime - Format it to 'YYYY-MM-DDTHH:MM'
    let eventDateTime = cells[3].textContent; // assuming this is in a non-standard format
    let formattedDateTime = formatDateTime(eventDateTime); // Convert to 'YYYY-MM-DDTHH:MM'

    document.getElementById('update-input-eventDateTime').value = formattedDateTime; // Set to datetime-local input field
    
    // For dropdown (clubId), set the selected option
    let clubId = cells[1].textContent; 
    
    document.getElementById('update-input-clubId').value = clubId;  


    // update the selected row
    let updateEventForm = document.getElementById('update-event-form-ajax');

    // Remove any previously attached submit event handler before adding a new one (without this, it updates all previously updated rows)
    updateEventForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit event handler
    updateEventForm.addEventListener("submit", updateSubmitHandler);   
}

// Function to format datetime to 'YYYY-MM-DDTHH:MM' format
function formatDateTime(dateTime) {
    // Assuming dateTime is in the format 'MM/DD/YYYY HH:MM AM/PM' or 'YYYY-MM-DD HH:MM AM/PM'
    let dateObj = new Date(dateTime); // Convert to Date object
    if (isNaN(dateObj)) {
        console.error("Invalid date format:", dateTime);
        return "";
    }

    // Extract the date and time in the required format
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    let day = String(dateObj.getDate()).padStart(2, '0'); // Get day
    let hours = String(dateObj.getHours()).padStart(2, '0'); // Get hours
    let minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Get minutes

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format as 'YYYY-MM-DDTHH:MM'
}


function updateRow(data, eventId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("event-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == eventId) {

            // Get the location of the row where we found the matching eventId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let clubIdCell = updateRowIndex.getElementsByTagName("td")[1];
            let nameCell = updateRowIndex.getElementsByTagName("td")[2];
            let descCell = updateRowIndex.getElementsByTagName("td")[4];
            let datetimeCell = updateRowIndex.getElementsByTagName("td")[3];

            clubIdCell.innerHTML = parsedData[0].clubId;
            nameCell.innerHTML = parsedData[0].eventName;
            descCell.innerHTML = parsedData[0].eventDescription;
            datetimeCell.innerHTML = parsedData[0].eventDateTime;
       }
    }
}
