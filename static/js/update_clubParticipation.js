

// Citation for the following update file
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateClubParticipationForm = document.getElementById('update-clubParticipation-form-ajax');

// Modify the objects we need
updateClubParticipationForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClubParticipationId = document.getElementById("mySelect");
    let inputClubId = document.getElementById("input-clubId-update");

    // Get the values from the form fields
    let clubParticipationIdValue = inputClubParticipationId.value; 
    let clubIdValue = inputClubId.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(clubIdValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        clubParticipationId: clubParticipationIdValue,
        clubId: clubIdValue,
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

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, clubParticipationId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("clubParticipation-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == clubParticipationId) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1]; // changed to 1 since club is the second one

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].clubId; 
       }
    }
}
