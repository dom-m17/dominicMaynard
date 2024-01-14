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

$('#address-btn').click(function() {
    $.ajax({
        url: "php/nearestAddress.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#address-lat').val(),
            lng: $('#address-lng').val(),
        },
        success: function(result) {
                console.log(result);
                console.log("Success")
				$('#address-street').html(result.data.address.street);
				$('#address-name').html(result.data.address.placename);
				$('#address-code').html(result.data.address.countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
            $('#address-street').html("There is no address at those coordinates");
            $('#address-name').html("");
            $('#address-code').html("");
        }
    }); 
});

$('#wiki-btn').click(function() {
    $.ajax({
        url: "php/wikiSearch.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: $('#wiki-q').val(),
        },
        success: function(result) {
            if (result.data.geonames.length !== 0) {
                console.log(result);
                console.log("Success")
				$('#wiki-title').html(result.data.geonames[0].title);
				$('#wiki-summary').html(result.data.geonames[0].summary);
				$('#wiki-url').html(result.data.geonames[0].wikipediaUrl);
            } else {
                console.log(`Error`);
                $('#wiki-title').html("That is not a valid search");
                $('#wiki-summary').html("");
                $('#wiki-url').html("");
            }    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
            $('#wiki-title').html("That is not a valid search");
            $('#wiki-summary').html("");
            $('#wiki-url').html("");
        }
    }); 
});