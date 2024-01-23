import countryInfo from './countryInfo.js'

$(document).ready(function() {

    function getContinent(url, data=countryInfo[$('#countrySelect').val()]["countryCode"]) {
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

    function getCapitalCity(url, data=countryInfo[$('#countrySelect').val()]["countryCode"]) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#capital-city').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);
                
            }
        })
    }

    function getArea(url, data=countryInfo[$('#countrySelect').val()]["countryCode"]) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    const formattedData = parseInt(result["data"], 10).toLocaleString('en-US');
                    $('#land-area').html(formattedData);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);
                
            }
        })
    }

    function getPopulation(url, data=countryInfo[$('#countrySelect').val()]["countryCode"]) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    const formattedData = parseInt(result["data"], 10).toLocaleString('en-US');
                    $('#population').html(formattedData);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);
                
            }
        })
    }

    function getCurrency(url, data=countryInfo[$('#countrySelect').val()]["countryCode"]) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#currency').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);
                
            }
        })
    }

    function getTemperature(url, coordinates={
        lat: countryInfo[$('#countrySelect').val()]["lat"],
        lon: countryInfo[$('#countrySelect').val()]["lon"]
    }) {

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                lat: coordinates["lat"],
                lon: coordinates["lon"]
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#temperature').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);               
            }
        })
    }

    function getDescription(url, coordinates={
        lat: countryInfo[$('#countrySelect').val()]["lat"],
        lon: countryInfo[$('#countrySelect').val()]["lon"]
    }) {

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                lat: coordinates["lat"],
                lon: coordinates["lon"]
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#weather-description').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);               
            }
        })
    }

    function getWind(url, coordinates={
        lat: countryInfo[$('#countrySelect').val()]["lat"],
        lon: countryInfo[$('#countrySelect').val()]["lon"]
    }) {

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                lat: coordinates["lat"],
                lon: coordinates["lon"]
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#wind-speed').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);               
            }
        })
    }

    $('#countrySelect').on('change', function() {
        getContinent("/project1/libs/php/getContinent.php")
        getCapitalCity("/project1/libs/php/getCapitalCity.php")
        getArea("/project1/libs/php/getArea.php")
        getPopulation("/project1/libs/php/getPopulation.php")
        getCurrency("/project1/libs/php/getCurrency.php")
        getTemperature("/project1/libs/php/getTemperature.php")
        getDescription("/project1/libs/php/getPrecipitation.php")
        getWind("/project1/libs/php/getWind.php")
    });

    
});
