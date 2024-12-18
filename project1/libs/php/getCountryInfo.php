<?php
    $executionStartTime = microtime(true);

    $url = 'http://api.geonames.org/countryInfoJSON?lang=en&country=' . $_REQUEST['data'] . '&username=' . 'dom_m17';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    if ($result === false) {
        $output['status']['code'] = "500";
        $output['status']['name'] = "Internal Server Error";
        $output['status']['description'] = "Failed to retrieve data from external API";
    } else {
        $decode = json_decode($result, true);

        if ($decode === null) {
            $output['status']['code'] = "500";
            $output['status']['name'] = "Internal Server Error";
            $output['status']['description'] = "Failed to decode JSON response from external API";
        } else {
            if (!isset($decode["geonames"][0])) {
                $output['status']['code'] = "404";
                $output['status']['name'] = "Not Found";
                $output['status']['description'] = "Country data not found";
            } else {
                $output['status']['code'] = "200";
                $output['status']['name'] = "OK";
                $output['status']['description'] = "Success";
                $output['data'] = $decode["geonames"][0];
            }
        }
    }

    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
