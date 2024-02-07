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
        feelsLike: 0,
        humidity: 0,
        weatherDescription: "",
        windSpeed: 0,
        language: "",
        language2: "",
        language3: "",
        summary: "",
        wikiUrl: ""
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

    async function setParams() {
        const selectedISO_A2 = $('#countrySelect').val();
    
        return fetch('./resources/countryBorders.geo.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const selectedCountry = data.features.find(feature => feature.properties.iso_a2 === selectedISO_A2);
                countryInfo["iso_a2"] = selectedCountry.properties.iso_a2;
                countryInfo["iso_a3"] = selectedCountry.properties.iso_a3;
                countryInfo["name"] = selectedCountry.properties.name;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                throw error;
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
            countryInfo["landArea"] = data;
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
            countryInfo["population"] = data;
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
            countryInfo["exchangeRate"] = result.toFixed(2);
        } catch (error) {
            console.error('Error in getExchangeRate:', error);
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

    async function getWeather() {
        try {
            await getCapitalCity();
            const encodedCity = encodeURIComponent(countryInfo['capitalCity']);
            const result = await ajaxRequest("./libs/php/getWeather.php", {
                data: encodedCity
            });
            countryInfo["temperature"] = (result["main"]["temp"] - 273.15).toFixed(2) + "°C";
            countryInfo["feelsLike"] = (result["main"]["feels_like"] - 273.15).toFixed(2) + "°C";
            countryInfo["humidity"] = result["main"]["humidity"] + "%";
            countryInfo["windSpeed"] = (result["wind"]["speed"]).toFixed(0) + "mph";
            countryInfo["weatherDescription"] = result["weather"]["0"]["description"];
        } catch (error) {
            console.error('Error in getWeather:', error);
        }
    }

    async function getWiki() {
        try {
            await Promise.resolve(setParams());
            const encodedCountry = encodeURIComponent(countryInfo['name']);
            const result = await ajaxRequest("./libs/php/getWiki.php", {
                    data: encodedCountry
            });
            countryInfo["summary"] = result['geonames']['0']["summary"];
            countryInfo["wikiUrl"] = result['geonames']['0']["wikipediaUrl"];
        } catch (error) {
            console.error('Error in getContinent:', error);
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

            $('#loading-spinner').show();

            await Promise.all([
                setParams(),
                getContinent(),
                getCapitalCity(),
                getArea(),
                getPopulation(),
                getCurrencyCode(),
                getExchanceRate(),
                getCurrency(),
                getLanguage(),
                getWeather(),
                getWiki()
            ]);
    
            setFlag();
    
            $('#continent').html(countryInfo["continent"]);
            $('#capital-city').html(countryInfo["capitalCity"]);
            $('#land-area').html(countryInfo["landArea"]);
            $('#population').html(countryInfo["population"]);
            $('#currency').html(countryInfo["currency"]);
            $('#exchange-rate').html(countryInfo["exchangeRate"]);
            $('#temperature').html(countryInfo["temperature"]);
            $('#feels-like').html(countryInfo["feelsLike"]);
            $('#humidity').html(countryInfo["humidity"]);
            $('#weather-description').html(countryInfo["weatherDescription"]);
            $('#wind-speed').html(countryInfo["windSpeed"]);
            $('#language').html(countryInfo["language"]);
            if (countryInfo["language2"]) {$('#language').append('<br>' + countryInfo["language2"]);}
            if (countryInfo["language3"]) {$('#language').append('<br>' + countryInfo["language3"]);}
            $('#summary').html(countryInfo["summary"]);

            const wikiUrl = countryInfo["wikiUrl"];
            if (wikiUrl) {
                const absoluteUrl = wikiUrl.startsWith('http') ? wikiUrl : `http://${wikiUrl}`;
                const linkElement = `<a href="${absoluteUrl}" target="_blank">${absoluteUrl}</a>`;
                $('#wiki-url').html(linkElement);
            } else {
                $('#wiki-url').html("No Wikipedia link available");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            $('#loading-spinner').hide();
        }
    });
});
