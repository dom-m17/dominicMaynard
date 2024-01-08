<?php

function getOcean($params) {
    $lat = $params['lat'];
    $lng = $params['lng'];

    try {
        $url = "http://api.geonames.org/oceanJSON?lat={$lat}&lng={$lng}&username=dom_m17";
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        return $data;
    } catch (Exception $error) {
        echo 'Error making API call: ' . $error->getMessage();
    }
}

?>