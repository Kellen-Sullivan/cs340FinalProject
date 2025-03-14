// declare global so that updateSubmitHandler can access this var
let globalCategoryId = -1;

/*
Following code section was adapted from my cs290 final project
*/
///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE Update Category Particpation MODAL

//show the update category modal when clicked
function showUpdateModal(event) {
    var modal = document.getElementById("update-category-modal");
    var backdrop = document.getElementById("update-modal-backdrop");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
}

//close the add category Particpation modal when X or cancel clicked
function closeUpdateModal(event) {
    var modal = document.getElementById("update-category-modal");
    var backdrop = document.getElementById("update-modal-backdrop");
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
}

//get the X from modal 
var closeX = document.getElementById("update-modal-close");
closeX.addEventListener("click", closeUpdateModal);
//////////////////////////////////////////////////////////////////////////

// function to call update row with correct values when submit is pressed
function updateSubmitHandler(e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCategoryName = document.getElementById("update-input-categoryName");
    let inputCategoryDescription = document.getElementById("update-input-categoryDescription");

    // Get the values from the form fields
    let categoryIdValue = globalCategoryId;
    let categoryNameValue = inputCategoryName.value;
    let categoryDescriptionValue = inputCategoryDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        categoryId: categoryIdValue,
        categoryName: categoryNameValue,
        categoryDescription: categoryDescriptionValue,
    }

    if (isNaN(categoryIdValue)) // if both entries are empty return
    {
        return;
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, categoryIdValue);
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
function updateCategory(categoryId) {
    // show modal and set up closeing button
    showUpdateModal();
    var closeX = document.getElementById("update-modal-close");
    closeX.addEventListener("click", closeUpdateModal);

    // update global var value
    globalCategoryId = categoryId;

/*----------------------code for prepopulating all fields with current values----------------*/
    // Get the row for this clubId
    let row = document.querySelector(`tr[data-value="${categoryId}"]`);
    let cells = row.getElementsByTagName('td');

    // Populate form fields with current values
    document.getElementById('update-input-categoryName').value = cells[1].textContent; // categoryName
    document.getElementById('update-input-categoryDescription').value = cells[3].textContent; // categoryDescription


    // update the selected row
    let updateCategoryForm = document.getElementById('update-category-form-ajax');

    // Remove any previously attached submit category handler before adding a new one (without this, it updates all previously updated rows)
    updateCategoryForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit category handler
    updateCategoryForm.addEventListener("submit", updateSubmitHandler);   
}


function updateRow(data, categoryId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("category-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == categoryId) {

            // Get the location of the row where we found the matching categoryId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let nameCell = updateRowIndex.getElementsByTagName("td")[1];
            let sizeCell = updateRowIndex.getElementsByTagName("td")[2];
            let descCell = updateRowIndex.getElementsByTagName("td")[3];

            nameCell.innerHTML = parsedData[0].categoryName;
            sizeCell.innerHTML = parsedData[0].categorySize;
            descCell.innerHTML = parsedData[0].categoryDescription;
       }
    }
}
