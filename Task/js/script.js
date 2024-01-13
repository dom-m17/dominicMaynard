import { ajax } from 'jquery';

$('#ocean-btn').click(function()  {
    $.ajax({
        url: "/Task/php/oceans.php",
        type: "POST",
        datatype: "json",
        data: {
            lat: document.getElementById("ocean-lat").value,
            lng: document.getElementById("ocean-lng").value
        },
        success: function(result) {
            console.log(result)
        },
        error: function() {
            console.log("There was an error.")
        }
    }
    
    )
})