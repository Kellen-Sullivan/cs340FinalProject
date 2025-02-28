// Citation for the following update feature
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
function deleteClubParticipation(clubParticipationId) {
    let link = '/delete-clubParticipation-ajax/';
    let data = {
      id: clubParticipationId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(clubParticipationId);
      }
    });
  }
  
  function deleteRow(clubParticipationId){
      let table = document.getElementById("clubParticipation-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == clubParticipationId) {
              table.deleteRow(i);
              break;
         }
      }
  }


  // TO ADD LATER WHEN EVERYTHING ELSE IS WORKING
  // function deleteDropDownMenu(personID){
  //   let selectMenu = document.getElementById("mySelect");
  //   for (let i = 0; i < selectMenu.length; i++){
  //     if (Number(selectMenu.options[i].value) === Number(personID)){
  //       selectMenu[i].remove();
  //       break;
  //     } 
  
  //   }
  // }