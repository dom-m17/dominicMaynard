<?php
    $executionStartTime = microtime(true);

    $url = "http://api.openweathermap.org/data/2.5/weather?q=" . $_REQUEST["data"] . "&appid=" . "35942d8d5701a5f9be6ebbebc92bd9a2";
    // $url = "http://api.weatherapi.com/v1/current.json?q=" . $_REQUEST["data"] . "&dt=2024-04-03&days=3&key=" . "62089aef46b547949f1131959240204"; // This endpoint returns better results but is not working
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
        if ($decode === null || !isset($decode["main"])) {
            $output['status']['code'] = "500";
            $output['status']['name'] = "Internal Server Error";
            $output['status']['description'] = "Unexpected response format from external API";
        } else {
            $output['status']['code'] = "200";
            $output['status']['name'] = "OK";
            $output['status']['description'] = "Success";
            $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
            $output['data'] = $decode;
        }
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);