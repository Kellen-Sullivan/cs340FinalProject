// Citation for the following update feature
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
function deleteStudent(studentId) {
    let link = '/delete-student-ajax/';
    let data = {
      id: studentId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(studentId);
      }
    });
  }
  
  function deleteRow(studentId){
    console.log("here")
      let table = document.getElementById("student-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == studentId) {
              table.deleteRow(i);
              break;
         }
      }
  }
