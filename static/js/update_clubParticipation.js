// declare global so that updateSubmitHandler can access this var
let globalClubParticipationId = -1;

/*
Modal Code was apated from a similar modal code in our CS 290 final project 
Date: 3/13/2025 
Adapted from My CS290 final project code which was adapted from the given Rob Hess code 
Source URL: https://github.com/osu-cs290-f24/handlebars-templating
*/
// SHOWING AND HIDING THE Update Club Particpation MODAL

//show the update club Particpation modal when clicked
function showModal(event) {
    var modal = document.getElementById("update-clubParticipation-modal")
    var backdrop = document.getElementById("update-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//close the add club Particpation modal when X or cancel clicked
function closeModal(event) {
    var modal = document.getElementById("update-clubParticipation-modal")
    var backdrop = document.getElementById("update-modal-backdrop") 
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")
}

//get the X from modal 
var closeX = document.getElementById("update-modal-close")
closeX.addEventListener("click", closeModal)
//////////////////////////////////////////////////////////////////////////

// function to call update row with correct values when submit is pressed
function updateSubmitHandler(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClubId = document.getElementById("input-clubId-update");
    //let inputStudentId = document.getElementById("input-studentId-update");

    // Get the values from the form fields
    let clubParticipationIdValue = globalClubParticipationId;
    let clubIdValue = inputClubId.value;
    //let studentIdValue = inputStudentId.value;
    
    if (isNaN(clubIdValue)) // if both entries are empty return
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        clubParticipationId: clubParticipationIdValue,
        clubId: clubIdValue
        // studentId: studentIdValue,
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

// Citation for the following code in this file
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
// let updateClubParticipationForm = document.getElementById('update-clubParticipation-form-ajax');

// // Modify the objects we need
// updateClubParticipationForm.addEventListener("submit", function (e) {
   
//     // Prevent the form from submitting
//     e.preventDefault();

//     // Get form fields we need to get data from
//     let inputClubParticipationId = document.getElementById("mySelect");
//     let inputClubId = document.getElementById("input-clubId-update");

//     // Get the values from the form fields
//     let clubParticipationIdValue = inputClubParticipationId.value; 
//     let clubIdValue = inputClubId.value;
    
//     if (isNaN(clubIdValue)) 
//     {
//         return;
//     }


//     // Put our data we want to send in a javascript object
//     let data = {
//         clubParticipationId: clubParticipationIdValue,
//         clubId: clubIdValue,
//     }
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("PUT", "/put-clubParticipation-ajax", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 200) {
//             // Add the new data to the table
//             updateRow(xhttp.response, clubParticipationIdValue);

//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 200) {
//             console.log("There was an error with the input.")
//         }
//     }

//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));

// })

function updateRow(data, clubParticipationId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("clubParticipation-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == clubParticipationId) {

            // Get the location of the row where we found the matching clubParticipationId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td = updateRowIndex.getElementsByTagName("td")[1]; // changed to 1 since club is the second one

            // Reassign to value we updated to
            td.innerHTML = parsedData[0].clubId; 
       }
    }
}
