$(document).ready(function() {

    // This is the object that will hold all data about the selected country.
    // It starts off blank and will get updated at the end of the script

    const countryInfo = {
        name: "",
        iso_a2: "",
        iso_a3: "",
        continent: "",
        capitalCity: "",
        landArea: 0,
        population: 0,
        currencyCode: "",
        currency: "",
        exchangeRate: 0,
        temperature: 0,
        weatherDescription: "",
        windSpeed: 0,
        language: "",
        language2: "",
        language3: ""
    }

    // The following functions are responsible for making ajax requests
    // that will update the countryInfo object

    function ajaxRequest(url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function(result) {
                    // console.log(result["data"]);
                    resolve(result["data"]);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Error');
                    reject(errorThrown);
                }
            });
        });
    }
    
    async function getContinent() {
        try {
            const result = await ajaxRequest("./libs/php/getContinent.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["continent"] = result;
        } catch (error) {
            console.error('Error in getContinent:', error);
        }
    }
    
    async function getCapitalCity() {
        try {
            const result = await ajaxRequest("./libs/php/getCapitalCity.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["capitalCity"] = result;
        } catch (error) {
            console.error('Error in getCapitalCity:', error);
        }
    }
    
    async function getArea() {
        try {
            const result = await ajaxRequest("./libs/php/getArea.php", {
                data: $('#countrySelect').val()
            });
            const data = parseInt(result, 10).toLocaleString('en-US');
            countryInfo["data"] = result;
        } catch (error) {
            console.error('Error in getArea:', error);
        }
    }
    
    async function getPopulation() {
        try {
            const result = await ajaxRequest("./libs/php/getPopulation.php", {
                data: $('#countrySelect').val()
            });
            const data = parseInt(result, 10).toLocaleString('en-US');
            countryInfo["population"] = result;
        } catch (error) {
            console.error('Error in getPopulation:', error);
        }
    }

    async function getCurrencyCode() {
        try {
            const result = await ajaxRequest("./libs/php/getCurrencyCode.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["currencyCode"] = result;
        } catch (error) {
            console.error('Error in getCurrencyCode:', error);
        }
    }

    async function getCurrency() {
        try {
            await getCurrencyCode();
            const result = await ajaxRequest("./libs/php/getCurrency.php", {
                data: countryInfo["currencyCode"]
            });
            countryInfo["currency"] = result;
        } catch (error) {
            console.error('Error in getCurrency:', error);
        }
    }
    
    async function getExchanceRate() {
        try {
            await getCurrencyCode();
            const result = await ajaxRequest("./libs/php/getExchangeRate.php", {
                data: countryInfo["currencyCode"]
            });
            countryInfo["exchangeRate"] = result;
        } catch (error) {
            console.error('Error in getExchangeRate:', error);
        }
    }

    async function getTemperature() {
        try {
            const result = await ajaxRequest("./libs/php/getTemperature.php", {
                lat: countryInfo[$('#countrySelect').val()]["lat"],
                lon: countryInfo[$('#countrySelect').val()]["lon"]
            });
            countryInfo["temperature"] = result;
        } catch (error) {
            console.error('Error in getTemperature:', error);
        }
    }
    
    async function getDescription() {
        try {
            const result = await ajaxRequest("./libs/php/getPrecipitation.php", {
                lat: countryInfo[$('#countrySelect').val()]["lat"],
                lon: countryInfo[$('#countrySelect').val()]["lon"]
            });
            countryInfo["weatherDescription"] = result;
        } catch (error) {
            console.error('Error in getDescription:', error);
        }
    }
    
    async function getWind() {
        try {
            const result = await ajaxRequest("./libs/php/getWind.php", {
                lat: countryInfo[$('#countrySelect').val()]["lat"],
                lon: countryInfo[$('#countrySelect').val()]["lon"]
            });
            countryInfo["windSpeed"] = result;
        } catch (error) {
            console.error('Error in getWind:', error);
        }
    }
    
    async function getLanguage() {
        try {
            const result = await ajaxRequest("./libs/php/getLanguage.php", {
                data: $('#countrySelect').val()
            });
            countryInfo["language"] = Object.values(result)[0];
            countryInfo["language2"] = Object.values(result)[1];
            countryInfo["language3"] = Object.values(result)[2];
        } catch (error) {
            console.error('Error in getLanguage:', error);
        }
    }

    function setFlag() {
        const countryCode = $('#countrySelect').val();
        const imgElement = $('<img>');
        imgElement.attr('src', `https://flagsapi.com/${countryCode}/shiny/48.png`);
        $('#flag').empty().append(imgElement);
    }

    // The below code will call the functions that will update the object.
    // Upon completion, a function will be called to update the HTML

    $('#countrySelect').on('change', async function() {
        try {
            await Promise.all([
                getContinent(),
                getCapitalCity(),
                getArea(),
                getPopulation(),
                getCurrencyCode(),
                getExchanceRate(),
                getCurrency(),
                // getTemperature(),
                // getDescription(),
                // getWind(),
                getLanguage()
            ]);

            console.log(countryInfo)
    
            setFlag();
    
            $('#continent').html(countryInfo["continent"]);
            $('#capital-city').html(countryInfo["capitalCity"]);
            $('#land-area').html(countryInfo["landArea"]);
            $('#population').html(countryInfo["population"]);
            $('#currency').html(countryInfo["currency"]);
            $('#exchange-rate').html(countryInfo["exchangeRate"]);
            $('#temperature').html(countryInfo["temperature"]);
            $('#weather-description').html(countryInfo["weatherDescription"]);
            $('#wind-speed').html(countryInfo["windSpeed"]);
            $('#language').html(countryInfo["language"]);
            if (countryInfo["language2"]) {$('#language').append('<br>' + countryInfo["language2"]);}
            if (countryInfo["language3"]) {$('#language').append('<br>' + countryInfo["language3"]);}
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});
