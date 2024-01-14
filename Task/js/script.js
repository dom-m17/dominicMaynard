$('#ocean-btn').click(function() {
    $.ajax({
        url: "php/oceans.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#ocean-lat').val(),
            lng: $('#ocean-lng').val(),
        },
        success: function(result) {
                console.log(result);
                console.log("Success")
				$('#ocean-geoname-id').html(result.data.ocean.geonameId);
				$('#ocean-name').html(result.data.ocean.name);
				$('#ocean-distance').html(result.data.ocean.distance);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
            $('#ocean-geoname-id').html("There is no ocean at those coordinates");
            $('#ocean-name').html("");
            $('#ocean-distance').html("");
        }
    }); 
});