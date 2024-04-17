$("#searchInp").on("keyup", function () {
  
    // your code
    
  });
  
$("#refreshBtn").click(function () {
  
  if ($("#personnelBtn").hasClass("active")) {
    
    // Refresh personnel table
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      // Refresh department table
      
    } else {
      
      // Refresh location table
      
    }
    
  }
  
});

$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  
});

$("#addBtn").click(function () {
  
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  
});

$("#personnelBtn").click(function () {
  
  // Call function to refresh personnel table
  
});

$("#departmentsBtn").click(function () {
  
  // Call function to refresh department table
  
});

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  
});

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
  $.ajax({
    url:
      "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id") 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
        
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// Executes when the form button with type="submit" is clicked

$("#editPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  
});

// This function populates the personnel table with ALL employees in the database
function getAllEmployees() {
  const result = $.ajax({
    url: './libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result["data"].forEach(function(employee) {
        // Create table row
        var tr = $('<tr>');

        // Create table data for name
        var name = employee.lastName + ', ' + employee.firstName;
        var nameTd = $('<td>').addClass('align-middle text-nowrap').text(name);
        tr.append(nameTd);

        // Create table data for job title
        var jobTitleTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.jobTitle);
        tr.append(jobTitleTd);

        // Create table data for department
        var departmentTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.department);
        tr.append(departmentTd);

        // Create table data for location
        var locationTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.location);
        tr.append(locationTd);

        // Create table data for email
        var emailTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.email);
        tr.append(emailTd);

        // Create table data for buttons
        var buttonsTd = $('<td>').addClass('text-end text-nowrap');
        var editButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#editPersonnelModal',
            'data-id': employee.id
        }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm deletePersonnelBtn').attr({
            'type': 'button',
            'data-id': employee.id
        }).html('<i class="fa-solid fa-trash fa-fw"></i>');
        buttonsTd.append(editButton, deleteButton);
        tr.append(buttonsTd);

        // Append the table row to the table body
        $('#personnelTableBody').append(tr);
    });
},
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error');
        console.log(errorThrown);
    }
  })
}  

// This function populates the departments table with ALL departments and the locations table with ALL the locations.
function getAllDepartmentsAndLocations() {
  let appendedLocations = []
  const result = $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      // Loop through each department in the result data
      result.data.forEach(function(department) {
        // Create a new table row
        var $row = $('<tr>');

        // Create and append table data for department name
        $row.append($('<td class="align-middle text-nowrap">').text(department.name));

        // Create and append table data for department location
        $row.append($('<td class="align-middle text-nowrap d-none d-md-table-cell">').text(department.location));

        // Create and append table data for edit and delete buttons
        var $buttonCell = $('<td class="align-middle text-end text-nowrap">');
        $buttonCell.append('<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button>');
        $buttonCell.append('<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + department.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>');
        $row.append($buttonCell);

        // Append the row to the table
        $('#departmentTableBody').append($row);
        
        if (!appendedLocations.includes(department.locationID)) {
          // Create a new table row
          var $row2 = $('<tr>');

          // Create and append table data for location name
          $row2.append($('<td class="align-middle text-nowrap">').text(department.location));

          // Create and append table data for edit and delete buttons
          var $buttonCell2 = $('<td class="align-middle text-end text-nowrap">');
          $buttonCell2.append('<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.locationID + '"><i class="fa-solid fa-pencil fa-fw"></i></button>');
          $buttonCell2.append('<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + department.locationID + '"><i class="fa-solid fa-trash fa-fw"></i></button>');
          $row2.append($buttonCell2);

          // Append the row to the table
          $('#locationTableBody').append($row2);
          appendedLocations.push(department.locationID)
        }
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error');
      console.log(errorThrown);
    }
  });
} 

$(document).ready(function() {

  getAllEmployees()
  getAllDepartmentsAndLocations()

})