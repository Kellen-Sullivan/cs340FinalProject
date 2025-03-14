// declare global so that updateSubmitHandler can access this var
let globalClubParticipationId = -1;

/*
Modal Code was apated from a similar modal code in our CS 290 final project 
Date: 3/13/2025 
Adapted from My CS290 final project code which was adapted from the given Rob Hess code 
Source URL: https://github.com/osu-cs290-f24/handlebars-templating
*/

//show the update club Particpation modal when clicked
function showModal(event) {
    var modal = document.getElementById("update-clubParticipation-modal");
    var backdrop = document.getElementById("update-modal-backdrop");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
}

//close the add club Particpation modal when X or cancel clicked
function closeModal(event) {
    var modal = document.getElementById("update-clubParticipation-modal");
    var backdrop = document.getElementById("update-modal-backdrop"); 
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
}

//get the X from modal 
var closeX = document.getElementById("update-modal-close");
closeX.addEventListener("click", closeModal);

// function to call update row with correct values when submit is pressed
function updateSubmitHandler(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClubId = document.getElementById("input-clubId-update");
    let inputStudentId = document.getElementById("input-studentId-update");

    // Get the values from the form fields
    let clubParticipationIdValue = globalClubParticipationId;
    let clubIdValue = inputClubId.value;
    let studentIdValue = inputStudentId.value;
    
    if (isNaN(clubIdValue) || isNaN(studentIdValue)) // if give clubIdValue is Null or studentIdValue is Null, return and don't attempt to update
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        clubParticipationId: clubParticipationIdValue,
        clubId: clubIdValue,
        studentId: studentIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-clubParticipation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, clubParticipationIdValue);
            // close the modal automatically after updating the row
            closeModal();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// function to show the modal with the form inside and close the modal when the user clicks the x
function updateClubParticipation(clubParticipationId) {
    // show modal and set up closeing button
    showModal();
    var closeX = document.getElementById("update-modal-close")
    closeX.addEventListener("click", closeModal)

    // update global var value
    globalClubParticipationId = clubParticipationId;

    // update the selected row
    let updateClubParticipationForm = document.getElementById('update-clubParticipation-form-ajax');

    // Remove any previously attached submit event handler before adding a new one (without this, it updates all previously updated rows)
    updateClubParticipationForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit event handler
    updateClubParticipationForm.addEventListener("submit", updateSubmitHandler);   
}

function updateRow(data, clubParticipationId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("clubParticipation-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == clubParticipationId) {

            // Get the location of the row where we found the matching clubParticipationId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

           // Get the cells from the DOM
           let clubNameCell = updateRowIndex.getElementsByTagName("td")[1];
           let studentFNameCell = updateRowIndex.getElementsByTagName("td")[2];
           let studentLNameCell = updateRowIndex.getElementsByTagName("td")[3];

           // update their values with corresponding new data
           clubNameCell.innerHTML = parsedData[0].clubName;
           studentFNameCell.innerHTML = parsedData[0].studentFName;
           studentLNameCell.innerHTML = parsedData[0].studentLName;
       }
    }
}
