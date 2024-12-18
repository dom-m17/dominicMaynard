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

$("#filterBtn").click(function () {

  $('#addFilterModal').modal('show');
  
});

$('#addFilterModal').on('show.bs.modal', function() {
  const savedDepartment = $('#addDepartmentFilter').val()
  $('#addDepartmentFilter').empty();
  $("#addDepartmentFilter").append("<option value=''>All</option>");
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result.data.forEach(function(department) {
        $("#addDepartmentFilter").append(
          $("<option>", {
            value: department.id,
            text: department.name
          })
        );
      });
      if (!savedDepartment) {
        $('#addDepartmentFilter')[0].selectedIndex = 0;
      } else {
        $('#addDepartmentFilter').val(savedDepartment);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error');
      console.log(errorThrown);
    }
  });
  const savedLocation = $('#addLocationFilter').val()
  $('#addLocationFilter').empty();
  $("#addLocationFilter").append("<option value=''>All</option>");
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      result.data.forEach(function(location) {
        $("#addLocationFilter").append(
          $("<option>", {
            value: location.id,
            text: location.name
          })
        );
      });
      if (!savedLocation) {
        $('#addLocationFilter')[0].selectedIndex = 0;
      } else {
        $('#addLocationFilter').val(savedLocation);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error');
      console.log(errorThrown);
    }
  });
})

$("#addDepartmentFilter").on('change', function () {
  $('#addLocationFilter')[0].selectedIndex = 0;

  if ($('#addDepartmentFilter')[0].selectedIndex != 0) {
    $.ajax({
      url:
        "libs/php/filterByDepartment.php",
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
    },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        alert("Error applying filter")
      }
    })
  } else {
    getAllEmployees()
  }
})

$("#addLocationFilter").on('change', function () {
  $('#addDepartmentFilter')[0].selectedIndex = 0;

  if ($('#addLocationFilter')[0].selectedIndex != 0) {
    $.ajax({
      url:
        "libs/php/filterByLocation.php",
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
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        alert("Error applying filter")
      }
    })
    } else {
      getAllEmployees()
    }
  }
)

$("#confirmPersonnelDelete").on("show.bs.modal", function (e) {
  
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      $('#idToDelete').val(result.data.personnel[0].id);
      $('#deletePersonnelMessage').html(`Are you sure you want to delete <strong>${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}</strong>?`);
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
});

$(document).on('click', '.deleteDepartmentBtn', function (e) {
  var departmentId = $(this).attr("data-id");
  $.ajax({
    url: "libs/php/checkDepartmentUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: departmentId
    },
    success: function (result) {
      if (result.data.personnel[0].personnelCount === 0) {
        $.ajax({
          url: "libs/php/getDepartmentByID.php",
          type: "POST",
          dataType: "json",
          data: {
            id: departmentId
          },
          success: function (result) {
            $('#idToDelete').val(departmentId);
            $('#deleteDepartmentMessage').html(`Are you sure you want to delete <strong>${result.data.department[0].name}</strong>?`);
            $('#confirmDepartmentDelete').modal('show')
          }, 
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        })
      } else {
        $("#cantDeleteDeptName").text(result.data.personnel[0].departmentName);
        $("#personnelCount").text(result.data.personnel[0].personnelCount);
        $("#cantDeleteDepartmentModal").modal("show");
      } 
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
});

$(document).on('click', '.deleteLocationBtn', function (e) {
  var locationId = $(this).attr("data-id");
  $.ajax({
    url: "libs/php/checkLocationUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: locationId
    },
    success: function (result) {
      if (result.data.department[0].departmentCount === 0) {
        $.ajax({
          url: "libs/php/getLocationByID.php",
          type: "POST",
          dataType: "json",
          data: {
            id: locationId
          },
          success: function (result) {
            $('#idToDelete').val(locationId);
            $('#deleteLocationMessage').html(`Are you sure you want to delete <strong>${result.data.location[0].name}</strong>?`);
            $('#confirmLocationDelete').modal('show')
          }, 
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        })
      } else {
        $("#cantDeleteLocationName").text(result.data.department[0].locationName);
        $("#departmentCount").text(result.data.department[0].departmentCount);
        $("#cantDeleteLocationModal").modal("show");
      } 
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
});

$("#deleteForm").on("submit", function (e) {

  e.preventDefault();

  if ($("#personnelBtn").hasClass("active")) {

    const result = $.ajax({
      url: 'libs/php/deletePersonnel.php',
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
        url: 'libs/php/deleteDepartmentbyID.php',
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
        url: 'libs/php/deleteLocation.php',
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
      url: 'libs/php/getAllDepartments.php',
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
        url: 'libs/php/getAllLocations.php',
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
  $("#filterBtn").attr("disabled", false);
  
});

$("#departmentsBtn").click(function () {
  
  getAllDepartments()
  $("#filterBtn").attr("disabled", true);
  
});

$("#locationsBtn").click(function () {
  
  getAllLocations()
  $("#filterBtn").attr("disabled", true);
  
});

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
  $.ajax({
    url:
      "libs/php/getPersonnelByID.php",
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
      "libs/php/editPersonnel.php",
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
      "libs/php/getDepartmentByID.php",
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
      "libs/php/editDepartment.php",
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
      "libs/php/editLocation.php",
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
      "libs/php/insertPersonnel.php",
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
      "libs/php/insertDepartment.php",
    type: 'POST',
    dataType: "json",
    data: {
      name: $("#addDepartmentName").val(),
      locationId: $("#addDepartmentLocation").val()
    },
    success: function () {
      console.log("Department successfully added");
      alert("Department succesfully added")
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
    url: 'libs/php/getAllLocations.php',
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
      "libs/php/insertLocation.php",
    type: 'POST',
    dataType: "json",
    data: {
      name: $("#addLocationName").val()
    },
    success: function (result) {
      console.log(result)
      console.log("Location successfully added");
      alert("Location succesfully added")
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
  $('#personnelTableBody').html("");
  const result = $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      var frag = document.createDocumentFragment();
      result["data"].forEach(function(employee) {
        // Create table row
        var tr = document.createElement("tr");

        // Create table data for name
        var name = employee.lastName + ', ' + employee.firstName;
        var nameTd = document.createElement("td");
        nameTd.classList = 'align-middle text-nowrap';
        var nameText = document.createTextNode(name);
        nameTd.append(nameText)
        tr.append(nameTd)

        // Create table data for job title
        var jobTitleTd = document.createElement("td");
        jobTitleTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var jobTitleText = document.createTextNode(employee.jobTitle);
        jobTitleTd.append(jobTitleText)
        tr.append(jobTitleTd)

        // Create table data for department
        var departmentTd = document.createElement("td");
        departmentTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var departmentText = document.createTextNode(employee.department);
        departmentTd.append(departmentText)
        tr.append(departmentTd)

        // Create table data for location
        var locationTd = document.createElement("td");
        locationTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var locationText = document.createTextNode(employee.location);
        locationTd.append(locationText)
        tr.append(locationTd)

        // Create table data for email
        var emailTd = document.createElement("td");
        emailTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var emailText = document.createTextNode(employee.email);
        emailTd.append(emailText)
        tr.append(emailTd)

        var buttonsTd = document.createElement("td");
        buttonsTd.classList = 'text-end text-nowrap'
        var editButton = document.createElement("button")
        editButton.classList = 'btn btn-primary btn-sm me-1'
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#editPersonnelModal');
        editButton.setAttribute('data-id', employee.id);
        editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
        var deleteButton = document.createElement("button")
        deleteButton.classList = 'btn btn-primary btn-sm'
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#confirmPersonnelDelete');
        deleteButton.setAttribute('data-id', employee.id);
        deleteButton.setAttribute('data-name', `${employee.firstName} ${employee.lastName}`);
        deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
        buttonsTd.append(editButton, deleteButton);
        tr.append(buttonsTd)

        // Append the table row to the table body
        frag.append(tr)
    });
    $('#personnelTableBody').append(frag);
},
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error');
        console.log(errorThrown);
    }
  })
}  

// This function searches the database for all employees matching the search criteria
function searchEmployees() {
  $('#personnelTableBody').html("");
  const result = $.ajax({
    url: 'libs/php/searchAll.php',
    type: 'POST',
    dataType: 'json',
    data: {
      "txt": $("#searchInp").val()
    },
    success: function(result) {
      var frag = document.createDocumentFragment();
      result["data"]["found"].forEach(function(employee) {
        // Create table row
        var tr = document.createElement("tr");

        // Create table data for name
        var name = employee.lastName + ', ' + employee.firstName;
        var nameTd = document.createElement("td");
        nameTd.classList = 'align-middle text-nowrap';
        var nameText = document.createTextNode(name);
        nameTd.append(nameText)
        tr.append(nameTd)

        // Create table data for job title
        var jobTitleTd = document.createElement("td");
        jobTitleTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var jobTitleText = document.createTextNode(employee.jobTitle);
        jobTitleTd.append(jobTitleText)
        tr.append(jobTitleTd)

        // Create table data for department
        var departmentTd = document.createElement("td");
        departmentTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var departmentText = document.createTextNode(employee.departmentName);
        departmentTd.append(departmentText)
        tr.append(departmentTd)

        // Create table data for location
        var locationTd = document.createElement("td");
        locationTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var locationText = document.createTextNode(employee.locationName);
        locationTd.append(locationText)
        tr.append(locationTd)

        // Create table data for email
        var emailTd = document.createElement("td");
        emailTd.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        var emailText = document.createTextNode(employee.email);
        emailTd.append(emailText)
        tr.append(emailTd)

        var buttonsTd = document.createElement("td");
        buttonsTd.classList = 'text-end text-nowrap'
        var editButton = document.createElement("button")
        editButton.classList = 'btn btn-primary btn-sm me-1'
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#editPersonnelModal');
        editButton.setAttribute('data-id', employee.id);
        editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
        var deleteButton = document.createElement("button")
        deleteButton.classList = 'btn btn-primary btn-sm'
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#confirmPersonnelDelete');
        deleteButton.setAttribute('data-id', employee.id);
        deleteButton.setAttribute('data-name', `${employee.firstName} ${employee.lastName}`);
        deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
        buttonsTd.append(editButton, deleteButton);
        tr.append(buttonsTd)

        // Append the table row to the table body
        frag.append(tr)
    });
    $('#personnelTableBody').append(frag);
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
  $("#addDepartmentFilter").append("<option value=''>All</option>");
  const result = $.ajax({
    url: 'libs/php/getAllDepartments.php',
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
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm deleteDepartmentBtn').attr({
            'type': 'button',
            // 'data-bs-toggle': 'modal',
            // 'data-bs-target': '#confirmDepartmentDelete',
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
  $("#addLocationFilter").append("<option value=''>All</option>");
  const result = $.ajax({
    url: 'libs/php/getAllLocations.php',
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
        var deleteButton = $('<button>').addClass('btn btn-primary btn-sm deleteLocationBtn').attr({
            'type': 'button',
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

$(document).ready(function() {

  getAllEmployees()
  getAllDepartments()
  getAllLocations()

})