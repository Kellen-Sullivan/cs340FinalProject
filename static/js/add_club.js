/*
Modal Code was apated from a similar modal code in our CS 290 final project 
Date: 3/13/2025 
Adapted from My CS290 final project code which was adapted from the given Rob Hess code 
Source URL: https://github.com/osu-cs290-f24/handlebars-templating
*/
// SHOWING AND HIDING THE ADD Club MODAL

//show the add club modal when clicked
function showAddModal(event) {
    var modal = document.getElementById("add-club-modal")
    var backdrop = document.getElementById("add-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//get the button from club page
var addClubButton = document.getElementById("add-club-button")
addClubButton.addEventListener("click", showAddModal)


//close the add club modal when X or cancel clicked
function closeAddModal(event) {
    var modal = document.getElementById("add-club-modal")
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
let addClubForm = document.getElementById('add-club-form-ajax');

// Modify the objects we need
addClubForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClubName = document.getElementById("input-clubName-add");
    let inputClubDescription = document.getElementById("input-clubDescription-add");
    let inputClubBudget = document.getElementById("input-clubBudget-add");
    let inputClubPresident = document.getElementById("input-clubPresident-add");
    let inputClubCategory = document.getElementById("input-clubCategory-add");

    // Get the values from the form fields
    let clubNameValue = inputClubName.value;
    let clubDescriptionValue = inputClubDescription.value;
    let clubBudgetValue = inputClubBudget.value;
    let clubPresidentValue = inputClubPresident.value;
    let clubCategoryValue = inputClubCategory.value;

    // Put our data we want to send in a javascript object
    let data = {
        clubName: clubNameValue,
        clubDescription: clubDescriptionValue,
        clubBudget: clubBudgetValue,
        clubPresident: clubPresidentValue,
        clubCategory: clubCategoryValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-club-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) { // maybe want to update to 2 (not sure what readyState does yet)

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputClubName.value = ' ';
            inputClubDescription.value = ' ';
            inputClubBudget.value = ' ';
            inputClubPresident.value = '';
            inputClubCategory.value = '';

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


// Creates a single row from an Object representing a single record from Club_Participation
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("club-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    console.log(newRowIndex);

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let clubIdCell = document.createElement("TD");
    let clubNameCell = document.createElement("TD");
    let clubDescriptionCell = document.createElement("TD");
    let clubBudgetCell = document.createElement("TD");
    let clubPresidentCell = document.createElement("TD");
    let clubCategoryCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    let updateCell = document.createElement("TD");

    // Fill the cells with correct data
    clubIdCell.innerText = newRow.clubId; // Should set the clubParticipationId automatically to the next val (auto-incrementing)
    clubNameCell.innerText = newRow.clubName;
    clubDescriptionCell.innerText = newRow.clubDescription;
    clubBudgetCell.innerText = newRow.clubBudget;
    clubPresidentCell.innerText = newRow.clubPresident;
    clubCategoryCell.innerText = newRow.clubCategory;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteClub(newRow.clubId);
    };
    deleteCell.appendChild(deleteButton)

    updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.onclick = function(){
        updateClub(newRow.clubId);
    };
    updateCell.appendChild(updateButton)

    // Add the cells to the row 
    row.appendChild(clubIdCell);
    row.appendChild(clubNameCell);
    row.appendChild(clubDescriptionCell);
    row.appendChild(clubBudgetCell);
    row.appendChild(clubPresidentCell);
    row.appendChild(clubCategoryCell);
    row.appendChild(deleteCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.clubId);
    
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
