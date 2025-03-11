// Citation for the following update feature
// Date: 2/27/2025
// Adapted from nodejs-starter app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
function deleteCategory(categoryId) {
    let link = '/delete-category-ajax/';
    let data = {
      id: categoryId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(categoryId);
      }
    });
  }
  
  function deleteRow(categoryId){
      let table = document.getElementById("category-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == categoryId) {
              table.deleteRow(i);
              break;
         }
      }
  }
