<?php

function getNearestAddress($params) {
    $lat = $params['lat'];
    $lng = $params['lng'];

    try {
        $url = "http://api.geonames.org/findNearestAddressJSON?lat={$lat}&lng={$lng}&username=dom_m17";
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        return $data;
    } catch (Exception $error) {
        echo 'Error making API call: ' . $error->getMessage();
    }
}

// Example usage:
$params = ['lat' => 40.7128, 'lng' => -74.0060];
$result = getNearestAddress($params);

// You can then use $result as needed.
?>