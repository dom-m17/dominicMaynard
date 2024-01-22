import countryInfo from './countryInfo.js'

$(document).ready(function() {

    function makeFirstAjaxRequest(url, data) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]); 
                    $('#continent').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);
                
            }
        })
    } 

    $('#countrySelect').on('change', function() {
        makeFirstAjaxRequest("/project1/libs/php/getContinent.php", countryInfo[$('#countrySelect').val()]["countryCode"])
        // console.log(countryInfo[$('#countrySelect').val()]["countryCode"])
    });

    
});
