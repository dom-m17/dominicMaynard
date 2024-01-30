$(document).ready(function() {

    function getContinent(url, data=$('#countrySelect').val()) {
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

    function getCapitalCity(url, data=$('#countrySelect').val()) {
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

    function getArea(url, data=$('#countrySelect').val()) {
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

    function getPopulation(url, data=$('#countrySelect').val()) {
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

    function getExchanceRate(url, data) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    $('#exchange-rate').html(result["data"]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error in er`);
                
            }
        })
    }

    function getFullCurrency(url, data) {
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
                console.log(`Error in gfc`);
                
            }
        })
    }

    function getCurrency(url, data=$('#countrySelect').val()) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);
                    getFullCurrency("/project1/libs/php/getFullCurrency.php", result["data"])
                    getExchanceRate("/project1/libs/php/getExchangeRate.php", result["data"])
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

    function getWeather(url, data=$('#countrySelect').val()) {

        console.log("The code given is " + data)

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(result["data"]);      
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error`);               
            }
        })
    }

    

    function getLanguage(url, data=$('#countrySelect').val()) {

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                data: data
            },
            success: function(result) {
                    console.log(Object.values(result["data"])[0]);
                    $('#languages').html(Object.values(result["data"])[0]);       
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error in lang`);
                
            }
        })
    }

    function getFlag() {
        const countryCode = $('#countrySelect').val();
        const imgElement = $('<img>');
        imgElement.attr('src', `https://flagsapi.com/${countryCode}/shiny/48.png`);
        $('#flag').empty().append(imgElement);
    }

    $('#countrySelect').on('change', function() {
        getContinent("./libs/php/getContinent.php")
        getCapitalCity("./libs/php/getCapitalCity.php")
        getArea("./libs/php/getArea.php")
        getPopulation("./libs/php/getPopulation.php")
        getCurrency("./libs/php/getCurrency.php")
        // getTemperature("./libs/php/getTemperature.php")
        // getDescription("./libs/php/getPrecipitation.php")
        // getWind("./libs/php/getWind.php")
        getLanguage("./libs/php/getLanguage.php")
        getFlag();
        getWeather("./libs/php/getWeather.php")
    });

    
});
