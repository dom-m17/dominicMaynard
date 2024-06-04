$("#searchInp").on("keyup", function () {
  
    searchEmployees();
    
  });
  
$("#refreshBtn").click(function () {
  
  if ($("#personnelBtn").hasClass("active")) {
    
    getAllEmployees()
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      getAllDepartments()
      
    } else {
      
      getAllLocations()
      
    }
    
  }
  
});

$("#chooseFilterBy").on('change', function () {
  $("#departmentFilter").css('display', 'none')
  $("#locationFilter").css('display', 'none')

  if ($("#chooseFilterBy").val() === "Department") {

    $("#departmentFilter").css('display', 'block')
  
  } else if ($("#chooseFilterBy").val() === "Location") {

    $("#locationFilter").css('display', 'block')
  
  }
})

$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  $('#addDepartmentFilter')[0].selectedIndex = 0;
  $('#addLocationFilter')[0].selectedIndex = 0;
  $('#chooseFilterBy')[0].selectedIndex = 0;
  $("#departmentFilter").css('display', 'none')
  $("#locationFilter").css('display', 'none')
  $('#addFilterModal').modal('show');
  
});

$("#addFilterBtn").click(function (e) {

  if ($("#chooseFilterBy").val() === "Department") {

    $.ajax({
      url:
        "./libs/php/filterByDepartment.php",
      type: 'POST',
      dataType: "json",
      data: {
        data: $("#addDepartmentFilter").val()
      },
      success: function (result) {
        $('#personnelTableBody').empty();
        result["data"]["found"].forEach(function(employee) {
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
          var departmentTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.departmentName);
          tr.append(departmentTd);
  
          // Create table data for location
          var locationTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.locationName);
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
              'data-bs-toggle': 'modal',
              'data-bs-target': '#confirmDelete',
              'data-id': employee.id,
              'data-name': `${employee.firstName} ${employee.lastName}`
          }).html('<i class="fa-solid fa-trash fa-fw"></i>');
          buttonsTd.append(editButton, deleteButton);
          tr.append(buttonsTd);
  
          // Append the table row to the table body
          $('#personnelTableBody').append(tr);
      });
      console.log("Filter successfully applied");
    },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        alert("Error applying filter")
      }
    })
  
  } else if ($("#chooseFilterBy").val() === "Location") {

    $.ajax({
      url:
        "./libs/php/filterByLocation.php",
      type: 'POST',
      dataType: "json",
      data: {
        data: $("#addLocationFilter").val()
      },
      success: function (result) {
        $('#personnelTableBody').empty();
        result["data"]["found"].forEach(function(employee) {
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
          var departmentTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.departmentName);
          tr.append(departmentTd);
  
          // Create table data for location
          var locationTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.locationName);
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
              'data-bs-toggle': 'modal',
              'data-bs-target': '#confirmDelete',
              'data-id': employee.id,
              'data-name': `${employee.firstName} ${employee.lastName}`
          }).html('<i class="fa-solid fa-trash fa-fw"></i>');
          buttonsTd.append(editButton, deleteButton);
          tr.append(buttonsTd);
  
          // Append the table row to the table body
          $('#personnelTableBody').append(tr);
      });
      console.log("Filter successfully applied");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        alert("Error applying filter")
      }
    })
  
  }
  
});

$("#confirmDelete").on("show.bs.modal", function (e) {
  $('#idToDelete').val($(e.relatedTarget).attr("data-id"));
  $('#deleteMessage').html(`Are you sure you want to delete ${$(e.relatedTarget).attr("data-name")}?`);
});

$("#deleteBtn").click(function (e) {

  if ($("#personnelBtn").hasClass("active")) {

    const result = $.ajax({
      url: './libs/php/deletePersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: {
        id: $('#idToDelete').val()
      },
      success: function(result) {
        console.log("Employee succesfully deleted")
        alert("Employee succesfully deleted")
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error deleting employee');
        console.log(errorThrown);
      }
    });
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {

      const result = $.ajax({
        url: './libs/php/deleteDepartmentbyID.php',
        type: 'POST',
        dataType: 'json',
        data: {
          id: $('#idToDelete').val()
        },
        success: function(result) {
          console.log("Department succesfully deleted")
          alert("Department succesfully deleted")
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error deleting department');
          console.log(errorThrown);
        }
      });
      
    } else {

      const result = $.ajax({
        url: './libs/php/deleteLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
          id: $('#idToDelete').val()
        },
        success: function(result) {
          console.log("Location succesfully deleted")
          alert("Location succesfully deleted")
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error deleting location');
          console.log(errorThrown);
        }
      });
      
    }
    
  }
  
});

$("#addBtn").click(function () {
  
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display

  if ($("#personnelBtn").hasClass("active")) {
    
    // Add employee modal appears
    // User presses cancel (close modal) or save (next step)
    // When save pressed, make ajax request with inputted data (check all required data exists)
    // If successful, alert user that employee was added. If failed, alert user that there was an error
    $('#addPersonnelModal').modal('show');
    $("#addPersonnelDepartment").empty();
    $("#addPersonnelDepartment").append("<option value='' selected disabled>Select Department</option>");
    const result = $.ajax({
      url: './libs/php/getAllDepartments.php',
      type: 'POST',
      dataType: 'json',
      success: function(result) {
        result.data.forEach(function(department) {
          $("#addPersonnelDepartment").append(
            $("<option>", {
              value: department.id,
              text: department.name
            })
          );
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error');
        console.log(errorThrown);
      }
    });
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      $('#addDepartmentModal').modal('show');
      $("#addDepartmentLocation").empty();
      $("#addDepartmentLocation").append("<option value='' selected disabled>Select Location</option>");
      const result = $.ajax({
        url: './libs/php/getAllLocations.php',
        type: 'POST',
        dataType: 'json',
        success: function(result) {
          let appendedLocations = [];
          result.data.forEach(function(location) {
            if (!appendedLocations.includes(location.id)) {
            $("#addDepartmentLocation").append(
              $("<option>", {
                value: location.id,
                text: location.name
              })
            );
            appendedLocations.push(location.id);
            }
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error');
          console.log(errorThrown);
        }
      });
      
    } else {
      
      $('#addLocationModal').modal('show');
      
    }
    
  }
  
});

$("#personnelBtn").click(function () {
  
  searchEmployees()
  
});

$("#departmentsBtn").click(function () {
  
  getAllDepartments()
  
});

$("#locationsBtn").click(function () {
  
  getAllLocations()
  
});

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
  $.ajax({
    url:
      "./libs/php/getPersonnelByID.php",
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

$("#editPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/editPersonnel.php",
    type: 'POST',
    dataType: "json",
    data: {
      id: $("#editPersonnelEmployeeID").val(),
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      email: $("#editPersonnelEmailAddress").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      department: $("#editPersonnelDepartment").val(),
    },
    success: function () {
      // $("#notification").text("Employee successfully updated").removeClass("error").addClass("success").fadeIn();
      console.log("Employee successfully updated");
      alert("Employee succesfully updated") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      // $("#notification").text("Error updating employee: " + errorThrown).removeClass("success").addClass("error").fadeIn();
      console.log(errorThrown);
      alert("Error updating employee")
    }
  })
});

$("#editDepartmentModal").on("show.bs.modal", function (e) {

  $("#editDepartmentLocation").html("")
  
  $.ajax({
    url:
      "./libs/php/getDepartmentByID.php",
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

        $("#editDepartmentID").val(result.data.department[0].id);

        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editDepartmentName").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editDepartmentLocation").val(result.data.department[0].locationID);
        
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

$("#editDepartmentForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/editDepartment.php",
    type: 'POST',
    dataType: "json",
    data: {
      id: $("#editDepartmentID").val(),
      name: $("#editDepartmentName").val(),
      locationId: $("#editDepartmentLocation").val()
    },
    success: function () {
      console.log("Department successfully updated");
      alert("Department succesfully updated") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("Error updating department")
    }
  })
});

$("#editLocationModal").on("show.bs.modal", function (e) {
  
  $("#editLocationID").val($(e.relatedTarget).attr("data-id"));

  $("#editLocationName").val($(e.relatedTarget).attr("data-name"));
        
});

$("#editLocationForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/editLocation.php",
    type: 'POST',
    dataType: "json",
    data: {
      id: $("#editLocationID").val(),
      name: $("#editLocationName").val()
    },
    success: function () {
      console.log("Location successfully updated");
      alert("Location succesfully updated") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("Error updating location")
    }
  })
});

$("#addPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/insertPersonnel.php",
    type: 'POST',
    dataType: "json",
    data: {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      email: $("#addPersonnelEmailAddress").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      departmentId: $("#addPersonnelDepartment").val(),
    },
    success: function () {
      // $("#notification").text("Employee successfully updated").removeClass("error").addClass("success").fadeIn();
      console.log("Employee successfully added");
      alert("Employee succesfully added") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      // $("#notification").text("Error updating employee: " + errorThrown).removeClass("success").addClass("error").fadeIn();
      console.log(errorThrown);
      alert("Error adding employee")
    }
  })
});

$("#addDepartmentForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/insertDepartment.php",
    type: 'POST',
    dataType: "json",
    data: {
      name: $("#addDepartmentName").val(),
      locationId: $("#addDepartmentLocation").val()
    },
    success: function () {
      console.log("Department successfully updated");
      alert("Department succesfully added") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("Error adding department")
    }
  })
});

$("#addDepartmentForm").on("show.bs.modal", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  const result = $.ajax({
    url: './libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result.data.forEach(function(location) {

      })
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
});

$("#addLocationForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url:
      "./libs/php/insertLocation.php",
    type: 'POST',
    dataType: "json",
    data: {
      name: $("#addLocationName").val()
    },
    success: function (result) {
      console.log(result)
      console.log("Location successfully added");
      alert("Location succesfully added") // This should be changed so a modal is used rather than a window popup
      },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("Error adding location")
    }
  })
});


// This function populates the personnel table with ALL employees in the database
function getAllEmployees() {
  $("#searchInp").val("")
  $('#personnelTableBody').empty();
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
        var editButton = $('<button>').addClass('btn btn-primary btn-sm me-1').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#editPersonnelModal',
            'data-id': employee.id
        }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#confirmDelete',
            'data-id': employee.id,
            'data-name': `${employee.firstName} ${employee.lastName}`
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

// This function searches the database for all employees matching the search criteria
function searchEmployees() {
  $('#personnelTableBody').empty();
  const result = $.ajax({
    url: './libs/php/searchAll.php',
    type: 'POST',
    dataType: 'json',
    data: {
      "txt": $("#searchInp").val()
    },
    success: function(result) {
      result["data"]["found"].forEach(function(employee) {
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
        var departmentTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.departmentName);
        tr.append(departmentTd);

        // Create table data for location
        var locationTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.locationName);
        tr.append(locationTd);

        // Create table data for email
        var emailTd = $('<td>').addClass('align-middle text-nowrap d-none d-md-table-cell').text(employee.email);
        tr.append(emailTd);

        // Create table data for buttons
        var buttonsTd = $('<td>').addClass('text-end text-nowrap');
        var editButton = $('<button>').addClass('btn btn-primary btn-sm me-1').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#editPersonnelModal',
            'data-id': employee.id
        }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#confirmDelete',
            'data-id': employee.id,
            'data-name': `${employee.firstName} ${employee.lastName}`
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

// This function populates the departments table with ALL departments.
function getAllDepartments() {
  $("#searchInp").val("");
  $('#departmentTableBody').empty();
  $('#addDepartmentFilter').empty();
  $("#addDepartmentFilter").append("<option value='' selected disabled>Select Department</option>");
  const result = $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result.data.forEach(function(department) {
        var $row = $('<tr>');
        $row.append($('<td class="align-middle text-nowrap">').text(department.name));
        var buttonsTd = $('<td>').addClass('text-end text-nowrap');
        var editButton = $('<button>').addClass('btn btn-primary me-1 btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#editDepartmentModal',
            'data-id': department.id
        }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#confirmDelete',
            'data-id': department.id,
            'data-name': department.name
        }).html('<i class="fa-solid fa-trash fa-fw"></i>');
        buttonsTd.append(editButton, deleteButton);
        $row.append(buttonsTd);
        $('#departmentTableBody').append($row);

        $("#addDepartmentFilter").append(
          $("<option>", {
            value: department.id,
            text: department.name
          })
        );
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error');
      console.log(errorThrown);
    }
  });
}

// This function populates the locations table with ALL the locations.
function getAllLocations() {
  $('#locationTableBody').empty();
  $('#addLocationFilter').empty();
  $("#addLocationFilter").append("<option value='' selected disabled>Select Location</option>");
  const result = $.ajax({
    url: './libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result.data.forEach(function(location) {
        var $row = $('<tr>');
        $row.append($('<td class="align-middle text-nowrap">').text(location.name));
        var buttonsTd = $('<td>').addClass('text-end text-nowrap');
        var editButton = $('<button>').addClass('btn btn-primary me-1 btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#editLocationModal',
            'data-id': location.id,
            'data-name': location.name
        }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
            'type': 'button',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#confirmDelete',
            'data-id': location.id,
            'data-name': location.name
        }).html('<i class="fa-solid fa-trash fa-fw"></i>');
        buttonsTd.append(editButton, deleteButton);
        $row.append(buttonsTd);
        $('#locationTableBody').append($row);

        $("#addLocationFilter").append(
          $("<option>", {
            value: location.id,
            text: location.name
          })
        );
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error');
      console.log(errorThrown);
    }
  });
}

// This function populates the departments table with ALL departments and the locations table with ALL the locations.
// function getAllDepartmentsAndLocations() {
//   $("#searchInp").val("")
//   $('#departmentTableBody').empty();
//   $('#locationTableBody').empty();
//   let appendedLocations = []
//   const result = $.ajax({
//     url: './libs/php/getAllDepartments.php',
//     type: 'POST',
//     dataType: 'json',
//     success: function(result) {
//       // Loop through each department in the result data
//       result.data.forEach(function(department) {
//         // Create a new table row
//         var $row = $('<tr>');

//         // Create and append table data for department name
//         $row.append($('<td class="align-middle text-nowrap">').text(department.name));

//         // Create and append table data for department location
//         $row.append($('<td class="align-middle text-nowrap d-none d-md-table-cell">').text(department.location));

//         // Create and append table data for edit and delete buttons
//         var buttonsTd = $('<td>').addClass('text-end text-nowrap');
//         var editButton = $('<button>').addClass('btn btn-primary btn-sm').attr({
//             'type': 'button',
//             'data-bs-toggle': 'modal',
//             'data-bs-target': '#editDepartmentModal',
//             'data-id': department.id
//         }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
//         var deleteButton = $('<button>').addClass('btn btn-primary btn-sm deleteDepartmentBtn').attr({
//             'type': 'button',
//             'data-id': department.id
//         }).html('<i class="fa-solid fa-trash fa-fw"></i>');
//         buttonsTd.append(editButton, deleteButton);
//         $row.append(buttonsTd);

//         // Append the row to the table
//         $('#departmentTableBody').append($row);
        
//         if (!appendedLocations.includes(department.locationID)) {
//           // Create a new table row
//           var $row2 = $('<tr>');

//           // Create and append table data for location name
//           $row2.append($('<td class="align-middle text-nowrap">').text(department.location));

//           // Create and append table data for edit and delete buttons
//           var buttonsTd2 = $('<td>').addClass('text-end text-nowrap');
//           var editButton2 = $('<button>').addClass('btn btn-primary btn-sm').attr({
//               'type': 'button',
//               'data-bs-toggle': 'modal',
//               'data-bs-target': '#editLocationModal',
//               'data-id': department.locationID,
//               'data-name': department.location
//           }).html('<i class="fa-solid fa-pencil fa-fw"></i>');
//           var deleteButton2 = $('<button>').addClass('btn btn-primary btn-sm deleteLocationBtn').attr({
//               'type': 'button',
//               'data-id': department.locationID,
//               'data-name': department.location
//           }).html('<i class="fa-solid fa-trash fa-fw"></i>');
//           buttonsTd2.append(editButton2, deleteButton2);
//           $row2.append(buttonsTd2);

//           // Append the row to the table
//           $('#locationTableBody').append($row2);
//           appendedLocations.push(department.locationID)
//         }
//       });
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log('Error');
//       console.log(errorThrown);
//     }
//   });
// } 

$(document).ready(function() {

  getAllEmployees()
  getAllDepartments()
  getAllLocations()

})