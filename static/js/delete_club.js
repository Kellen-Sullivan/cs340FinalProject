// Citation for the following update feature
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
function deleteClub(clubId) {
    let link = '/delete-club-ajax/';
    let data = {
      id: clubId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(clubId);
      }
    });
  }
  
  function deleteRow(clubId){
      let table = document.getElementById("club-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == clubId) {
              table.deleteRow(i);
              break;
         }
      }
  }
