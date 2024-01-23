<?php

    $executionStartTime = microtime(true);

    // First API call to get Lat and Lon

    $url="http://api.openweathermap.org/geo/1.0/direct?q=" . "London" . "&limit=5&appid=" . "35942d8d5701a5f9be6ebbebc92bd9a2";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result,true);

    $output['lat'] = ($decode[0]["lat"]);
    $output['lon'] = ($decode[0]["lon"]);

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 