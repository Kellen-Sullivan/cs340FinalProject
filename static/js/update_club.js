// declare global so that updateSubmitHandler can access this var
let globalClubId = -1;

/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE Update Club Particpation MODAL

//show the update club Particpation modal when clicked
function showUpdateModal(event) {
    var modal = document.getElementById("update-club-modal")
    var backdrop = document.getElementById("update-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//close the add club Particpation modal when X or cancel clicked
function closeUpdateModal(event) {
    var modal = document.getElementById("update-club-modal")
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
    let inputClubName = document.getElementById("input-clubName-update");
    let inputClubDescription = document.getElementById("input-clubDescription-update");
    let inputClubBudget = document.getElementById("input-clubBudget-update");
    let inputClubPresident = document.getElementById("input-clubPresident-update");
    let inputClubCategory = document.getElementById("input-clubCategory-update");
    

    // Get the values from the form fields
    let clubIdValue = globalClubId;
    let clubNameValue = inputClubName.value;
    let clubDescriptionValue = inputClubDescription.value;
    let clubBudgetValue = inputClubBudget.value;
    let clubPresidentValue = inputClubPresident.value;
    let clubCategoryValue = inputClubCategory.value;
    
    if (isNaN(clubIdValue)) // if both entries are empty return
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        clubId: clubIdValue,
        clubName: clubNameValue,
        clubDescription: clubDescriptionValue,
        clubBudget: clubBudgetValue,
        clubPresident: clubPresidentValue,
        clubCategory: clubCategoryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-club-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, clubIdValue);
            // close the modal automatically after updating the row
            closeUpdateModal();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// function to show the modal with the form inside and close the modal when the user clicks the x
function updateClub(clubId) {
    // show modal and set up closeing button
    showUpdateModal();
    var closeX = document.getElementById("update-modal-close")
    closeX.addEventListener("click", closeUpdateModal)

    // update global var value
    globalClubId = clubId;

    /*----------------------code for prepopulating all fields with current values----------------*/
    // Get the row for this clubId
    let row = document.querySelector(`tr[data-value="${clubId}"]`);
    let cells = row.getElementsByTagName('td');

    // Populate form fields with current values
    document.getElementById('input-clubName-update').value = cells[1].textContent; // clubName
    document.getElementById('input-clubDescription-update').value = cells[2].textContent; // clubDescription
    document.getElementById('input-clubBudget-update').value = cells[3].textContent; // clubBudget
    
    presidentId = row.getAttribute('data-clubPresidentId');
    presidentSelect = document.getElementById('input-clubPresident-update');
    if (presidentSelect.value === "NULL") {
        presidentSelect.value = "None";
    }
    else {
        presidentSelect.value = presidentId;
    }

    categoryId = row.getAttribute('data-clubCategoryId');
    categorySelect = document.getElementById('input-clubCategory-update');
    if (categorySelect.value === "NULL") {
        categorySelect.value = "None";
    } 
    else {
        categorySelect.value = categoryId;
    }
    /*----------------------code for prepopulating all fields with current values-----------------*/

    // update the selected row
    let updateClubForm = document.getElementById('update-club-form-ajax');

    // Remove any previously attached submit event handler before adding a new one (without this, it updates all previously updated rows)
    updateClubForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit event handler
    updateClubForm.addEventListener("submit", updateSubmitHandler);   
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

function updateRow(data, clubId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("club-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == clubId) {

            // Get the location of the row where we found the matching clubId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let nameCell = updateRowIndex.getElementsByTagName("td")[1];
            let descCell = updateRowIndex.getElementsByTagName("td")[2];
            let budgetCell = updateRowIndex.getElementsByTagName("td")[3];
            let presidentCell = updateRowIndex.getElementsByTagName("td")[4];
            let categoryCell = updateRowIndex.getElementsByTagName("td")[5];

            nameCell.innerHTML = parsedData[0].clubName;
            descCell.innerHTML = parsedData[0].clubDescription;
            budgetCell.innerHTML = parsedData[0].clubBudget;
            presidentCell.innerHTML = parsedData[0].clubPresident;
            categoryCell.innerHTML = parsedData[0].clubCategory;
       }
    }
}
