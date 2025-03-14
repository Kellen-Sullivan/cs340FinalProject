// declare global so that updateSubmitHandler can access this var
let globalStudentId = -1;

/*
Modal Code was apated from a similar modal code in our CS 290 final project 
Date: 3/13/2025 
Adapted from My CS290 final project code which was adapted from the given Rob Hess code 
Source URL: https://github.com/osu-cs290-f24/handlebars-templating
*/
// SHOWING AND HIDING THE Update Club Particpation MODAL

//show the update club Particpation modal when clicked
function showUpdateModal(event) {
    var modal = document.getElementById("update-student-modal")
    var backdrop = document.getElementById("update-modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}

//close the add club Particpation modal when X or cancel clicked
function closeUpdateModal(event) {
    var modal = document.getElementById("update-student-modal")
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
    let inputStudentFName = document.getElementById("input-studentFName-update");
    let inputStudentLName = document.getElementById("input-studentLName-update");
    let inputStudentEmail = document.getElementById("input-studentEmail-update");
    let inputStudentMajor = document.getElementById("input-studentMajor-update");
    let inputStudentGrade = document.getElementById("input-studentGrade-update");
    

    // get global studentId value
    let studentIdValue = globalStudentId;

    // Get the values from the form fields
    let studentFNameValue = inputStudentFName.value;
    let studentLNameValue = inputStudentLName.value;
    let studentEmailValue = inputStudentEmail.value;
    let studentMajorValue = inputStudentMajor.value;
    let studentGradeValue = inputStudentGrade.value;
    
    if (isNaN(studentIdValue)) // if both entries are empty return
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        studentId: studentIdValue,
        studentFName: studentFNameValue,
        studentLName: studentLNameValue,
        studentEmail: studentEmailValue,
        studentMajor: studentMajorValue,
        studentGrade: studentGradeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, studentIdValue);
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
function updateStudent(studentId) {
    // show modal and set up closeing button
    showUpdateModal();
    var closeX = document.getElementById("update-modal-close")
    closeX.addEventListener("click", closeUpdateModal)

    // update global var value
    globalStudentId = studentId;

    /*----------------------code for prepopulating all fields with current values----------------*/
    // Get the row for this studentId
    let row = document.querySelector(`tr[data-value="${studentId}"]`);
    let cells = row.getElementsByTagName('td');

    // Populate form fields with current values
    document.getElementById('input-studentFName-update').value = cells[1].textContent; 
    document.getElementById('input-studentLName-update').value = cells[2].textContent; 
    document.getElementById('input-studentEmail-update').value = cells[3].textContent;
    document.getElementById('input-studentMajor-update').value = cells[4].textContent; 
    document.getElementById('input-studentGrade-update').value = cells[5].textContent; 
    /*----------------------code for prepopulating all fields with current values-----------------*/

    // update the selected row
    let updateStudentForm = document.getElementById('update-student-form-ajax');

    // Remove any previously attached submit event handler before adding a new one (without this, it updates all previously updated rows)
    updateStudentForm.removeEventListener("submit", updateSubmitHandler);
    
    // Add the submit event handler
    updateStudentForm.addEventListener("submit", updateSubmitHandler);   
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

function updateRow(data, studentId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("student-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == studentId) {

            // Get the location of the row where we found the matching clubId
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let fNameCell = updateRowIndex.getElementsByTagName("td")[1];
            let lNameCell = updateRowIndex.getElementsByTagName("td")[2];
            let emailCell = updateRowIndex.getElementsByTagName("td")[3];
            let majorCell = updateRowIndex.getElementsByTagName("td")[4];
            let gradeCell = updateRowIndex.getElementsByTagName("td")[5];

            fNameCell.innerHTML = parsedData[0].studentFName;
            lNameCell.innerHTML = parsedData[0].studentLName;
            emailCell.innerHTML = parsedData[0].studentEmail;
            majorCell.innerHTML = parsedData[0].studentMajor;
            gradeCell.innerHTML = parsedData[0].studentGrade;
       }
    }
}
