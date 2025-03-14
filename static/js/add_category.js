/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE ADD Category MODAL

//show the add category modal when clicked
function showAddModal(event) {
    var modal = document.getElementById("add-category-modal");
    var backdrop = document.getElementById("add-modal-backdrop");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
}

//get the button from category page
var addClubButton = document.getElementById("add-category-button");
addClubButton.addEventListener("click", showAddModal);

//close the add category modal when X or cancel clicked
function closeAddModal(event) {
    var modal = document.getElementById("add-category-modal");
    var backdrop = document.getElementById("add-modal-backdrop");
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
}

//get the X from modal 
var closeX = document.getElementById("add-modal-close");
closeX.addEventListener("click", closeAddModal);
//////////////////////////////////////////////////////////////////////////


// Citation for the following code in this file
// Date: 2/26/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addCategoryForm = document.getElementById('add-category-form-ajax');

// Modify the objects we need
addCategoryForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCategoryName = document.getElementById("input-categoryName");
    let inputCategoryDescription = document.getElementById("input-categoryDescription");

    // Get the values from the form fields
    let categoryNameValue = inputCategoryName.value;
    let categoryDescriptionValue = inputCategoryDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        categoryName: categoryNameValue,
        categoryDescription: categoryDescriptionValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) { 

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCategoryName.value = '';
            inputCategoryDescription.value = '';

            // Close the modal automatically after pressing submit
            closeAddModal();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Categories
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("category-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    console.log(newRowIndex);

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let categoryIdCell = document.createElement("TD");
    let categoryNameCell = document.createElement("TD");
    let categorySizeCell = document.createElement("TD");
    let categoryDescriptionCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");
    let updateCell = document.createElement("TD");

    // Fill the cells with correct data
    categoryIdCell.innerText = newRow.categoryId; // Should set the categoryId automatically to the next val (auto-incrementing)
    categoryNameCell.innerText = newRow.categoryName;
    categorySizeCell.innerText = newRow.categorySize;
    categoryDescriptionCell.innerText = newRow.categoryDescription;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteCategory(newRow.categoryId);
    };
    deleteCell.appendChild(deleteButton);

    updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.onclick = function(){
        updateCategory(newRow.categoryId);
    };
    updateCell.appendChild(updateButton);

    // Add the cells to the row 
    row.appendChild(categoryIdCell);
    row.appendChild(categoryNameCell);
    row.appendChild(categorySizeCell);
    row.appendChild(categoryDescriptionCell);


    row.appendChild(deleteCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.categoryId);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
