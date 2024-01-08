<?php

function getWikiSearch($params) {
    $q = urlencode($params['q']);

    try {
        $url = "http://api.geonames.org/wikipediaSearchJSON?q={$q}&maxRows=1&username=dom_m17";
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        return $data;
    } catch (Exception $error) {
        echo 'Error making API call: ' . $error->getMessage();
    }
}

?>