// declare global so that updateSubmitHandler can access this var
let globalEventId = -1;

/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE Update Event Particpation MODAL

//show the update event Particpation modal when clicked
function showUpdateModal(event) {
    var modal = document.getElementById("update-event-modal")
    var backdrop = document.getElementById("update-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//close the add event Particpation modal when X or cancel clicked
function closeUpdateModal(event) {
    var modal = document.getElementById("update-event-modal")
    var backdrop = document.getElementById("update-modal-backdrop") 
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")
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
            console.log("There was an error with the input.")
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

    // update the selected row
    let updateEventForm = document.getElementById('update-event-form-ajax');

    // Remove any previously attached submit event handler before adding a new one (without this, it updates all previously updated rows)
    updateEventForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit event handler
    updateEventForm.addEventListener("submit", updateSubmitHandler);   
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

            let nameCell = updateRowIndex.getElementsByTagName("td")[1];
            let descCell = updateRowIndex.getElementsByTagName("td")[2];
            let budgetCell = updateRowIndex.getElementsByTagName("td")[3];

            nameCell.innerHTML = parsedData[0].eventName;
            descCell.innerHTML = parsedData[0].eventDescription;
            budgetCell.innerHTML = parsedData[0].eventBudget;
       }
    }
}
